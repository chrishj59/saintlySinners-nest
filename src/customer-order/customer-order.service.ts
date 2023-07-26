import axios from 'axios';
import {
  GetObjectCommand,
  ListBucketsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectAws } from 'aws-sdk-v3-nest';
import PDFDocument from 'pdfkit';
import { Country } from 'src/common/entity/country.entity';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';
import { RemoteFilesService } from 'src/remote-files/remote-files.service';
import { USER } from 'src/user/entity/user.entity';
import { PRODUCT_VENDOR } from 'src/vendor/entity/vendor.entity';
import { Repository, UpdateResult } from 'typeorm';

import { EDC_PRODUCT } from '../edc/entities/edc-product';
import {
  CustomerOrderDto,
  EditCustomerOrderDto,
} from './dtos/customerOrder.dto';
import { CUSTOMER_ORDER } from './entities/customerOrder.entity';
import { CUSTOMER_ORDER_LINE } from './entities/customerOrderLine.entity';
import { EdcOrderCreatedResponseDto } from 'src/dtos/edc-order-created.reponse.dto';
import { CustOrderUpdatedResponseDto } from 'src/dtos/cust-order-updated.response.dto';
import { NotificationService } from 'src/notification/notification.service';
import { CUSTOMER_INVOICE_PDF } from 'src/remote-files/entity/customerInvoiceFile.entity';
import { edcOrderStatusEnum } from 'src/edc/enums/Edc-order-status.enum';
import { getDay } from 'date-fns';
import { isAfter } from 'date-fns';
import { format, add } from 'date-fns';

//import { S3Client } from '@aws-sdk/client-s3';
type prodLine = {
  artnr: string;
};
type invLineType = {
  artnr: string;
  title: string;
  quantity: number;
  price: number;
  vat_rate: number;
  line_total: number;
};

type GetCustomerOrderResponse = {
  data: CUSTOMER_ORDER;
};

const client = new S3Client({});
@Injectable()
export class CustomerOrderService {
  constructor(
    @InjectRepository(PRODUCT_VENDOR)
    private vendorRepository: Repository<PRODUCT_VENDOR>,
    @InjectRepository(EDC_PRODUCT)
    private prodRepo: Repository<EDC_PRODUCT>,
    @InjectRepository(Country)
    private countryRepo: Repository<Country>,
    @InjectRepository(USER)
    private userRepo: Repository<USER>,
    @InjectRepository(CUSTOMER_ORDER)
    private custOrderRepo: Repository<CUSTOMER_ORDER>,
    @InjectRepository(CUSTOMER_ORDER_LINE)
    private custOrderLineRepo: Repository<CUSTOMER_ORDER_LINE>,
    @InjectAws(S3Client)
    private readonly s3: S3Client,
    private readonly configService: ConfigService,
    private readonly filesService: RemoteFilesService,
    private readonly notificationService: NotificationService,
  ) {}

  logger = new Logger('CustomerOrderService');
  PDFDocument = require('pdfkit');

  customerInformationTop = 200;

  async saveOrder(
    dto: CustomerOrderDto,
  ): Promise<ResponseMessageDto | EdcOrderCreatedResponseDto> {
    this.logger.warn(`save order called with ${JSON.stringify(dto, null, 2)}`);

    const vend = await this.vendorRepository.findOne({
      where: { id: dto.vendorNumber },
    });

    const prods = await this.prodRepo
      .createQueryBuilder('edc_product')
      .where('edc_product.artnr IN (:...artnr)', { artnr: dto.products })
      .getMany();
    const inv_lines: CUSTOMER_ORDER_LINE[] = [];
    let orderGoodsAmount: number = 0;

    /* VAT reg: not usede yet */
    let orderVAtAmount: number = 0;

    let OrderPayable: number = 0;
    const _artnrs: string[] = dto.products;
    _artnrs.map((el) => {
      const prod = prods.find((p: EDC_PRODUCT) => p.artnr === el);
      if (prod === undefined) {
        this.logger.warn(`could not find prod with artner: ${el}`);
      } else {
        inv_lines.findIndex;
        const invLineIdx = inv_lines.findIndex(
          (invEl: CUSTOMER_ORDER_LINE) => invEl.prodRef === el,
        );
        if (invLineIdx === -1) {
          const _invLine: CUSTOMER_ORDER_LINE = new CUSTOMER_ORDER_LINE();
          (_invLine.prodRef = prod.artnr),
            (_invLine.description = prod.title),
            (_invLine.quantity = 1),
            (_invLine.price = prod.b2c.toString()),
            (_invLine.vatRate = prod.vatRateUk / 100),
            (_invLine.lineTotal = prod.b2c.toString());
          _invLine.edcProduct = prod;

          inv_lines.push(_invLine);
        } else {
          const _invLine: CUSTOMER_ORDER_LINE = inv_lines[invLineIdx];
          _invLine.quantity++;

          _invLine.lineTotal = (
            parseFloat(_invLine.price) * _invLine.quantity
          ).toString();
          inv_lines[invLineIdx] = _invLine;
        }
      }
    });

    /** Calculate oreder total net, vat and payable */
    inv_lines.map((line: CUSTOMER_ORDER_LINE) => {
      orderGoodsAmount += parseFloat(line.lineTotal);
      const vat = parseFloat(line.lineTotal) * line.vatRate;
      orderVAtAmount += vat;
    });

    /** VAT reg - when registered add VAT to payable */
    OrderPayable = orderGoodsAmount;

    let country: Country;
    let customer: USER;
    if (dto.oneTimeCustomer) {
      country = await this.countryRepo.findOne({
        where: {
          edcCountryCode: dto.customer.country,
        },
      });

      customer = await this.userRepo.findOne({
        where: {
          id: dto.customerId,
        },
      });
    }

    const custOrder = new CUSTOMER_ORDER();
    custOrder.vendor = vend;
    custOrder.lines = inv_lines;

    custOrder.stripeSession = dto.stripeSessionId;
    custOrder.oneTimeCustomer = dto.oneTimeCustomer;
    custOrder.goodsValue = orderGoodsAmount;
    custOrder.tax = orderVAtAmount;
    custOrder.total = OrderPayable;
    custOrder.currencyCode = dto.currencyCode;
    if (dto.oneTimeCustomer) {
      custOrder.customerTitle = dto.customer.customerTitle;
      custOrder.name = dto.customer.name;
      custOrder.houseNumber = dto.customer.houseNumber;
      custOrder.houseName = dto.customer.houseName;
      custOrder.street = dto.customer.street;
      custOrder.city = dto.customer.city;
      custOrder.county = dto.customer.county;
      custOrder.postCode = dto.customer.postCode;
      custOrder.zip = dto.customer.zip;
      custOrder.telphone = dto.customer.telphone;
      custOrder.email = dto.customer.email;
      custOrder.country = country;
      custOrder.orderLines = inv_lines;
    } else {
      custOrder.customer = customer;
    }
    let custOrderUpdated = await this.custOrderRepo.save(custOrder, {
      reload: true,
    });
    this.logger.warn(
      `custOrderUpdated house number: ${custOrderUpdated.houseNumber}`,
    );
    // const updatedLine = await this.custOrderLineRepo.save(inv_lines[0], {
    //   reload: true,
    // });
    if (custOrderUpdated) {
      // inv_lines.map(async (l: CUSTOMER_ORDER_LINE) => {
      //   //l.order = custOrderUpdated;
      //   const updatedLine = await this.custOrderLineRepo.save(l, {
      //     reload: true,
      //   });
      //   this.logger.log(`line item ${JSON.stringify(updatedLine, null, 2)}`);
      // });
      await this.createPDF(custOrderUpdated);
      this.logger.log('return after create PDF');
      return {
        status: MessageStatusEnum.SUCCESS,
        orderMessage: {
          orderNumber: custOrderUpdated.orderNumber,
          orderId: custOrderUpdated.id,
          //pdfid: custOrderUpdated.invoicePdf.key,
        },
      };
    } else {
      return {
        status: MessageStatusEnum.ERROR,
        message: `Could not save customer order`,
      };
    }
  }

  async getCustomerOrder(id: string): Promise<CUSTOMER_ORDER> {
    try {
      const order = await this.custOrderRepo.findOne({
        where: { id: id },
      });
      if (order) {
        return order;
      } else {
        throw new NotFoundException(`Order Number number ${id} is invalid `);
      }
    } catch (err) {
      throw new BadRequestException(
        `An unexpected error occurred loading order with id ${id} `,
      );
    }
    return null;
  }

  shippingDate(lines: CUSTOMER_ORDER_LINE[]): string {
    let shipDate: Date = new Date();
    this.logger.log(`init shipDate ${shipDate}`);
    for (const line of lines) {
      this.logger.log(`line.edcStockStatus ${line.edcStockStatus}`);
      switch (line.edcStockStatus) {
        case 'Y':
          let checkDate = add(shipDate, { days: 1 });
          this.logger.log(`init checkDate ${checkDate}`);
          if (isAfter(shipDate, checkDate)) {
            add(checkDate, { days: 1 });
            this.logger.log(`checkDate is before shipDate set to ${checkDate}`);
          }
          const dayOfWeek = getDay(checkDate);
          if (dayOfWeek === 0) {
            shipDate = add(checkDate, { days: 1 });
          } else if (dayOfWeek === 6) {
            shipDate = add(checkDate, { days: 2 });
          } else {
            shipDate = checkDate;
          }
          break;
        case 'N':
          checkDate = add(shipDate, { days: 1 });
          if (isAfter(shipDate, checkDate)) {
            add(checkDate, { days: 1 });
          }
          if (dayOfWeek === 0) {
            shipDate = add(checkDate, { days: 1 });
          } else if (dayOfWeek === 6) {
            shipDate = add(checkDate, { days: 2 });
          } else {
            shipDate = checkDate;
          }
      }
      this.logger.log(`final shipDate ${format(shipDate, 'do MMMM yyyy')}`);
      return format(shipDate, 'do MMMM yyyy');
    }
  }
  invHtml(lines: CUSTOMER_ORDER_LINE[]): string {
    const html = `<html> <style>
    p {
      color: purple;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 300;
      font-size: medium;
    }
    h1 {
      color: purple;
      font-family: Arial, Helvetica, sans-serif;
    }
  </style>
  
  <h1 style="color: purple;">Thank you for your puchase.</h1>
  <p style="color: purple;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 300;
  font-size: medium;"
  >Please find attached your invoice.</p>
  <p style="color: purple;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 300;
  font-size: medium;">The elves have started to work on your order and will be sending it on ${this.shippingDate(
    lines,
  )}</p>
  <p style="color: purple;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 300;
  font-size: medium;">Enjoy Saintly Sinners</p>
  </html>
  `;
    return html;
  }
  async updateCustomerOrder(
    id: string,
    custOrder: EditCustomerOrderDto,
  ): Promise<CustOrderUpdatedResponseDto> {
    this.logger.log(
      `updateCustomerOrder called with id ${id}, custOrder ${JSON.stringify(
        custOrder,
      )}`,
    );
    const result: UpdateResult = await this.custOrderRepo.update(id, custOrder);

    const resultstatus =
      result.affected === 1
        ? MessageStatusEnum.SUCCESS
        : MessageStatusEnum.WARNING;
    const orderUpdated = await this.custOrderRepo.findOne({
      where: { id: id },
      relations: ['invoicePdf', 'orderLines'],
    });
    console.log(`orderUpdated ${JSON.stringify(orderUpdated)}`);
    const invPdf = await this.getCustomerInvoice(id);
    const email = process.env.ADMIN_EMAIL;
    //const text: 'paid'

    await this.notificationService.notifyEmail({
      email,
      text: `Payment received for order: ${orderUpdated.orderNumber} EDC payment due ${orderUpdated.vendTotalPayable}`,
    });

    //TODO: Call notofication service to send invoice to customer
    const custEmail: string = orderUpdated.email;
    const subject: string = 'Your SaintlySinners Invoice';

    const body = this.invHtml(orderUpdated.orderLines); //`<html> Your invoice </html>`;
    const pdfBuffer = Buffer.from(invPdf);
    await this.notificationService.customerInvoiceEmail(
      custEmail,
      subject,
      body,
      pdfBuffer,
    );

    return {
      status: resultstatus,
      orderMessage: { orderId: id, rowsUpdated: result.affected },
    };
  }

  async getCustomerInvoice(id: any): Promise<Uint8Array> {
    const order = await this.custOrderRepo.findOne({
      where: { id: id },
      relations: ['invoicePdf'],
    });

    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_INVOICE_BUCKET_NAME,
      Key: order.invoicePdf.key,
    });

    try {
      const res = await this.s3.send(getCommand);
      const pdfDoc = res.Body.transformToByteArray();
      return pdfDoc;
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  private async createPDF(order: CUSTOMER_ORDER) {
    const client = new S3Client({});
    const PDFDocument = require('pdfkit');
    let buffers = [];
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    await this.generateHeader(doc);
    this.generateCustomerInformation(doc, order);
    this.generateInvoiceTable(doc, order);
    this.generateFooter(doc);

    doc.end();
    //doc.pipe(() => {bcoded = Buffer.from(doc).toString('base64')})
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
      // add to S3Client
      const fileName = `invoice-${order.orderNumber}.pdf`;
      await this.filesService.uploadCustomerPdfFile(
        pdfData,
        order.id,
        fileName,
      );
      //order = await this.custOrderRepo.findOne({ where: { id: order.id } });
      //return order;
    });
    //return order;
  }

  private async generateHeader(doc: PDFKit.PDFDocument) {
    try {
      const getCommand = new GetObjectCommand({
        Bucket: 'saintly-sinners-public-bucket',
        Key: 'dainis-graveris-y2cOf7SfeMI-unsplash.jpg',
      });
      const response = await this.s3.send(getCommand);
      const jpgBuffer: Uint8Array = await response.Body.transformToByteArray();

      doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Saintly Sinners.', 110, 57)
        .fontSize(10)
        .text('66 Cop Lane', 464, 50)
        .text('Penwortham', 464, 65)
        .text('Lancashire', 464, 80)
        .text('England', 464, 95)
        .text('PR1 0UR', 464, 110)
        .moveDown();
    } catch (err) {
      this.logger.warn(`doc header err ${err}`);
    }
  }

  private generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
  private generateCustomerInformation(
    doc: PDFKit.PDFDocument,
    order: CUSTOMER_ORDER,
  ) {
    doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160);

    // this.generateHr(doc, 185);

    const address1 =
      // order.houseName
      //   ? order.houseName
      //   : null +
      // (order.houseNumber < 0 ? order.houseNumber : null) +
      order.street;

    doc
      .fontSize(10)
      .text('Invoice Number:', 50, this.customerInformationTop)
      .font('Helvetica-Bold')
      .text(order.orderNumber.toString(), 150, this.customerInformationTop)
      .font('Helvetica')
      .text('Invoice Date:', 50, this.customerInformationTop + 15)
      .text(
        this.formatDate(order.createdDate),
        150,
        this.customerInformationTop + 15,
      )

      .font('Helvetica-Bold')
      .text('Sold to:', 50, this.customerInformationTop + 60)
      .text(order.name, 50, this.customerInformationTop + 75)
      .font('Helvetica')
      .text(address1, 50, this.customerInformationTop + 90)
      .text(order.city, 50, this.customerInformationTop + 105)
      .text(order.county, 50, this.customerInformationTop + 120)
      .text(
        order.postCode.length > 0 ? order.postCode : order.zip.toString(),
        50,
        this.customerInformationTop + 135,
      )
      .text(order.country.name, 50, this.customerInformationTop + 150)
      .moveDown();
  }

  private generateInvoiceTable(doc: PDFKit.PDFDocument, order: CUSTOMER_ORDER) {
    let i: number;
    const invoiceTableTop = 370;

    doc.font('Helvetica-Bold');
    this.generateTitleTableRow(
      doc,
      invoiceTableTop,
      'Item',
      'Description',
      'Unit Cost',
      'Quantity',
      'Amount',
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');
    for (i = 0; i < order.lines.length; i++) {
      const item = order.lines[i];
      const LinePosition = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(doc, LinePosition, item);
    }

    //total goods value
    const position = invoiceTableTop + (i + 1) * 30;
    this.generateHr(doc, position - 5);
    const subtotalPosition = invoiceTableTop + (i + 1) * 30;

    this.generateTotalTableRow(
      doc,
      subtotalPosition,
      '',
      '',
      'Subtotal',
      '',
      this.formatCurrency(order.goodsValue * 100),
    );

    //   //VAT line
    const taxPosition = subtotalPosition + 20;
    //   this.generateTotalTableRow(
    // 	doc,
    // 	taxPosition,
    // 	'',
    // 	'',
    // 	'VAT',
    // 	'',
    // 	this.formatCurrency(order.tax)
    // );

    // payable line
    const totalPosition = taxPosition + 25;
    doc.font('Helvetica-Bold');
    this.generateTotalTableRow(
      doc,
      totalPosition,
      '',
      '',
      'Payable',
      '',
      this.formatCurrency(order.goodsValue * 100),
    );
    doc.font('Helvetica');
  }

  generateTitleTableRow(
    doc: PDFKit.PDFDocument,
    y: number,
    item: string,
    description: string,
    unitCost: string,
    quantity: string,
    lineTotal: string,
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  generateTotalTableRow(
    doc: PDFKit.PDFDocument,
    y: number,
    item: string,
    description: string,
    unitCost: string,
    quantity: string,
    lineTotal: string,
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  generateTableRow(
    doc: PDFKit.PDFDocument,
    y: number,
    item: CUSTOMER_ORDER_LINE,
  ) {
    const lineTotal = parseFloat(item.lineTotal) * 100;
    const price = parseFloat(item.price) * 100;

    doc
      .fontSize(10)
      .text(item.edcProduct.artnr, 50, y)
      .text(item.edcProduct.title, 150, y)

      .text(this.formatAmount(price), 280, y, {
        width: 90,
        align: 'right',
      })
      .text(item.quantity.toString(), 370, y, { width: 90, align: 'right' })
      .text(this.formatCurrency(lineTotal), 0, y, {
        align: 'right',
      });
  }

  generateFooter(doc: PDFKit.PDFDocument) {
    doc
      .fontSize(10)
      .text('Thank you for your business.', 50, 765, {
        align: 'center',
        width: 500,
      })
      .fontSize(7)
      .text(
        `Rationem trading as Saintly Sinners Reg. Number: 11112396`,
        40,
        780,
      )
      .text(
        `reg office: 3rd Floor Office, 207 Regent Street, London, England, W1B 3HH`,
        250,
        780,
      );
  }

  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // return year + '/' + month + '/' + day;
    return day + '/' + month + '/' + year;
  }

  private formatAmount(cents) {
    return (cents / 100).toFixed(2);
  }
  private formatCurrency(cents) {
    return '€  ' + (cents / 100).toFixed(2);
  }

  // save PDF fo aws-S3
}
