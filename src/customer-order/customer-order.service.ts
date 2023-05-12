import { S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import PDFDocument from 'pdfkit';
import { Country } from 'src/common/entity/country.entity';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';
import { RemoteFilesService } from 'src/remote-files/remote-files.service';
import { USER } from 'src/user/entity/user.entity';
import { PRODUCT_VENDOR } from 'src/vendor/entity/vendor.entity';
import { Repository } from 'typeorm';

import { EDC_PRODUCT } from '../edc/entities/edc-product';
import { CustomerOrderDto } from './dtos/customerOrder.dto';
import { CUSTOMER_ORDER } from './entities/customerOrder.entity';
import { CUSTOMER_ORDER_LINE } from './entities/customerOrderLine.entity';

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
    private custRepo: Repository<CUSTOMER_ORDER>,
    private readonly configService: ConfigService,
    private readonly filesService: RemoteFilesService,
  ) {}

  logger = new Logger('CustomerOrderService');
  PDFDocument = require('pdfkit');

  customerInformationTop = 200;

  async saveOrder(dto: CustomerOrderDto): Promise<ResponseMessageDto> {
    const vend = await this.vendorRepository.findOne({
      where: { id: dto.vendorNumber },
    });

    const prods = await this.prodRepo
      .createQueryBuilder('edc_product')
      .where('edc_product.artnr IN (:...artnr)', { artnr: dto.products })
      .getMany();
    console.log(`num prods ${prods.length}`);
    // prods.map((prod: EDC_PRODUCT) => {
    //   this.logger.log(
    //     `artnr ${prod.artnr} b2c ${prod.b2c} vat ${prod.vatRateUk}`,
    //   );
    // });
    const inv_lines: CUSTOMER_ORDER_LINE[] = [];
    let orderGoodsAmount: number = 0;

    /* VAT reg: not usede yet */
    let orderVAtAmount: number = 0;

    let OrderPayable: number = 0;
    const _artnrs: string[] = dto.products;
    console.log(`_artnrs: ${_artnrs}`);
    _artnrs.map((el) => {
      console.log(`el ${el}`);
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
      custOrder.country = country;
    } else {
      custOrder.customer = customer;
    }
    const custOrderUpdated = await this.custRepo.save(custOrder, {
      reload: true,
    });
    if (custOrderUpdated) {
      this.createPDF(custOrderUpdated);
      return {
        status: MessageStatusEnum.SUCCESS,
        message: custOrderUpdated.orderNumber.toString(),
      };
    } else {
      return {
        status: MessageStatusEnum.ERROR,
        message: `Could not save customer order`,
      };
    }
  }
  private createPDF(order: CUSTOMER_ORDER) {
    const client = new S3Client({});
    const PDFDocument = require('pdfkit');
    let buffers = [];
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    this.generateHeader(doc);
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
    });
  }

  private async generateHeader(doc: PDFKit.PDFDocument) {
    try {
      // const response = await client.send(command);
      // const status =  response.$metadata.httpStatusCode;
      //this.logger.log(`read aws http status ${status}`);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      //const pdf: Uint8Array = await response.Body.transformToByteArray();
      // console.log('after get body');
      //doc.image(pdf, 50, 45, { width: 50 });
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
      console.error(`doc header err ${err}`);
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
    console.log('called generateCustomerInformation');
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
