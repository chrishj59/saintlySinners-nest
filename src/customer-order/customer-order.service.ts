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
import { HttpService } from '@nestjs/axios';
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
  Product,
  Products,
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
import { ONE_TIME_CUSTOMER } from './entities/customerOrderCustomer.entity';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import { url } from 'inspector';
import { XTRADER_RESULT_INTERFACE } from 'src/common/interfaces/xtraderResult.interface';

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
    @InjectRepository(XTR_PRODUCT)
    private prodRepo: Repository<XTR_PRODUCT>,
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
    private readonly httpService: HttpService,
  ) {}

  logger = new Logger('CustomerOrderService');
  PDFDocument = require('pdfkit');

  customerInformationTop = 200;

  createCompareFn<T extends Object>(
    property: keyof T,
    sort_order: 'asc' | 'desc',
  ) {
    const compareFn = (a: T, b: T) => {
      const val1 = a[property];
      const val2 = b[property];
      const order = sort_order !== 'desc' ? 1 : -1;

      switch (typeof val1) {
        case 'number': {
          const valb = val2 as number;
          const result = val1 - valb;
          return result * order;
        }
        case 'string': {
          const valb = val2 as string;
          const result = val1.localeCompare(valb);
          return result * order;
        }
        // add other cases like boolean, etc.
        default:
          return 0;
      }
    };
    return compareFn;
  }

  async saveOrder(
    dto: CustomerOrderDto,
  ): Promise<ResponseMessageDto | EdcOrderCreatedResponseDto> {
    const vend = await this.vendorRepository.findOne({
      where: { id: dto.vendorNumber },
    });
    this.logger.log(`called save order with ${JSON.stringify(dto, null, 2)}`);
    // const prods = await this.prodRepo
    //   .createQueryBuilder('edc_product')
    //   .where('edc_product.artnr IN (:...artnr)', { artnr: dto.products })
    //   .getMany();

    const inv_lines: CUSTOMER_ORDER_LINE[] = [];
    let orderGoodsAmount: number = 0;

    /* VAT reg: not used yet */
    let orderVAtAmount: number = 0;

    let OrderPayable: number = 0;

    let vendorAmount: number = 0;

    const sortedProducts = dto.products.sort((a, b) =>
      a.model.localeCompare(b.model),
    );

    const models = sortedProducts.map((p) => p.model);
    const prods = await this.prodRepo
      .createQueryBuilder('xtr-product')
      .where('xtr-product.model IN (:...models)', {
        models: models,
      })
      .getMany();

    console.log(`prods found ${JSON.stringify(prods, null, 2)}`);
    if (prods) {
      prods.map((p: XTR_PRODUCT) => {
        const _prods = dto.products.find(
          (item: Product) => item.model === p.model,
        );
        if (!prods) {
          return;
        }
        const _lineTotal = (
          Number(p.retailPrice) * Number(_prods.quantity)
        ).toFixed(2);
        vendorAmount = vendorAmount + p.goodsPrice;
        const invLine = new CUSTOMER_ORDER_LINE();
        invLine.description = p.name;
        invLine.xtraderProduct = p;
        invLine.prodRef = p.model;
        this.logger.log(`p.retail_price ${p.retailPrice.toString()}`);
        // invLine.price = p.retailPrice
        invLine.price = Number(p.retailPrice).toFixed(2);
        invLine.quantity = _prods.quantity;
        invLine.vatRate = Number(process.env.VAT_STD) / 100;
        invLine.lineTotal = _lineTotal;
        invLine.attributeName = _prods.attributeName;
        invLine.attributeValue = _prods.attributeValue;
        inv_lines.push(invLine);
        this.logger.log(`invLine ${JSON.stringify(invLine)}`);
      });
    }
    // const _artnrs: string[] = dto.products;
    // _artnrs.map((el) => {
    //   const prod = prods.find((p: EDC_PRODUCT) => p.artnr === el);
    //   if (prod === undefined) {
    //     this.logger.warn(`could not find prod with artner: ${el}`);
    //   } else {
    //     inv_lines.findIndex;
    //     const invLineIdx = inv_lines.findIndex(
    //       (invEl: CUSTOMER_ORDER_LINE) => invEl.prodRef === el,
    //     );
    //     if (invLineIdx === -1) {
    //       const _invLine: CUSTOMER_ORDER_LINE = new CUSTOMER_ORDER_LINE();
    //       (_invLine.prodRef = prod.artnr),
    //         (_invLine.description = prod.title),
    //         (_invLine.quantity = 1),
    //         (_invLine.price = prod.b2c.toString()),
    //         (_invLine.vatRate = prod.vatRateUk / 100),
    //         (_invLine.lineTotal = prod.b2c.toString());
    //       _invLine.edcProduct = prod;

    //       inv_lines.push(_invLine);
    //     } else {
    //       const _invLine: CUSTOMER_ORDER_LINE = inv_lines[invLineIdx];
    //       _invLine.quantity++;

    //       _invLine.lineTotal = (
    //         parseFloat(_invLine.price) * _invLine.quantity
    //       ).toString();
    //       inv_lines[invLineIdx] = _invLine;
    //     }
    //   }
    // });

    /** Calculate order total net, vat and payable */
    inv_lines.map((line: CUSTOMER_ORDER_LINE) => {
      orderGoodsAmount += parseFloat(line.lineTotal);
      const vat = parseFloat(line.lineTotal) * line.vatRate;
      orderVAtAmount += parseFloat(vat.toFixed());
    });

    /** VAT reg - when registered add VAT to payable */
    OrderPayable = orderGoodsAmount;
    const vendorPayable = Number(vendorAmount) + Number(dto.delivery);

    let country: Country;
    let customer: USER;
    if (dto.oneTimeCustomer) {
      country = await this.countryRepo.findOne({
        where: {
          id: dto.customer.country,
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
    custOrder.vendTotalPayable = vendorPayable;
    custOrder.stripeSession = dto.stripeSessionId;
    custOrder.oneTimeCustomer = dto.oneTimeCustomer;
    custOrder.goodsValue = orderGoodsAmount;
    custOrder.tax = orderVAtAmount;
    custOrder.total = OrderPayable;
    custOrder.currencyCode = dto.currencyCode;
    if (dto.oneTimeCustomer) {
      this.logger.log('oneTimeCustomer ${dto.oneTimeCustomer}');
      const customerOneTime = new ONE_TIME_CUSTOMER();

      customerOneTime.title = dto.customer.title;
      customerOneTime.firstName = dto.customer.firstName;
      customerOneTime.lastName = dto.customer.lastName;
      // custOrder.houseNumber = dto.customer.hous§eNumber;
      // custOrder.houseName = dto.customer.houseName;
      customerOneTime.street = dto.customer.street;
      customerOneTime.street2 = dto.customer.street2;
      customerOneTime.city = dto.customer.city;
      customerOneTime.county = dto.customer.county;
      customerOneTime.postCode = dto.customer.postCode;
      // oneTimeCustomer.zip = dto.customer.zip;
      customerOneTime.telephone = dto.customer.telephone;
      customerOneTime.email = dto.customer.email;

      custOrder.customerOneTime = customerOneTime;
    } else {
      custOrder.customer = customer;
    }
    custOrder.country = country;
    custOrder.orderLines = inv_lines;

    let custOrderUpdated = await this.custOrderRepo.save(custOrder, {
      reload: true,
    });

    if (custOrderUpdated) {
      //TODO: create PDF invoice
      await this.createPDF(custOrderUpdated);

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

    for (const line of lines) {
      switch (line.edcStockStatus) {
        case 'Y':
          let checkDate = add(shipDate, { days: 1 });

          if (isAfter(shipDate, checkDate)) {
            add(checkDate, { days: 1 });
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

  private async sendOrderToXtrader(
    customerOrder: CUSTOMER_ORDER,
  ): Promise<XTRADER_RESULT_INTERFACE> {
    const vendorCode = process.env.XTRADER_CODE;
    const vendorPass = process.env.XTRADER_VENDOR_PASS;
    const xtaderPassword = process.env.XTRADER_PASSWORD;
    const accountid = process.env.XTRADER_ACCOUNT_ID;
    this.logger.log(
      `sendOrderToXtrader called with order ${JSON.stringify(
        customerOrder,
        null,
        2,
      )}`,
    );
    const xtrData = {
      Type: 'ORDEREXTOC',
      testingmode: true,
      VendorCode: process.env.XTRADER_ACCOUNT_ID, //55922,
      VendorTxCode: 'IDWEB-126284-TESTMODE-5628-20100304022456',
      VenderPass: process.env.XTRADER_VENDOR_PASS, //5886106859,
      VenderSite: process.env.XTRADER_VENDOR_SITE, //'https://www.saintlysinners.co.uk',
      Venderserial: process.env.XTRADER_CODE,
      //'FkeOh0dx4EVrlXTn1TP%3D%3DgMwIzMxIjM5ADOwIDNyMVbWVXSGR2bZdFezpFWshTTU',
      ShippingModule: 'tracked24',
      postage: 1,
      customerFirstName: 'Bob',
      customerLastName: 'Smith',
      deliveryAddress1: '12 Balaam Street',
      deliveryAddress2: '',
      deliveryTown: 'Plaistow',
      deliveryCounty: 'London',
      deliveryPostcode: 'NW13 8AQ',
      deliveryCountry: 'GB',
      ProductCodes: 'MODEL',
      Products: 'GO-4:1',
    };

    const rs = await axios.post<string>(`${process.env.XTRADER_URL}`, xtrData, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    const xtraderResult = rs.data;
    // console.warn(`xtraderResponse ${typeof xtraderResponse}`);

    const deliveryUrl = `https://www.xtrader.co.uk/catalog/orderstatusxml_auth.php?accountid=${accountid}&accountpass=${vendorPass}`;
    console.log(`deliveryUrl ${deliveryUrl}`);
    const { data } = await this.httpService.axiosRef.post<string>(deliveryUrl);
    this.logger.log(`Orderupdate  ${data}`);

    const resultArry = xtraderResult.split('|');
    const xtraderResultCode = resultArry[0];
    const valueArray = resultArry[2].split('=');

    return { status: xtraderResultCode, value: valueArray[1] };
  }

  async customerOrderPaid(
    id: string,
    custOrder: EditCustomerOrderDto,
  ): Promise<CustOrderUpdatedResponseDto> {
    this.logger.log(
      `updateCustomerOrder payload custOrder ${JSON.stringify(
        custOrder,
        null,
        2,
      )}`,
    );
    const customerOrder = await this.custOrderRepo.findOne({ where: { id } });
    if (!customerOrder) {
      throw new BadRequestException(`Order does not exists for id: ${id}`);
    }
    customerOrder.stripeSession = custOrder.stripeSession;
    customerOrder.orderStatus = edcOrderStatusEnum.STRIPE_PAID;

    const result: UpdateResult = await this.custOrderRepo.update(
      id,
      customerOrder,
    );

    const resultstatus =
      result.affected === 1
        ? MessageStatusEnum.SUCCESS
        : MessageStatusEnum.WARNING;
    this.logger.log('Updated customer order ');
    const orderUpdated = await this.custOrderRepo.findOne({
      where: { id: id },
      relations: ['customerOneTime', 'invoicePdf', 'orderLines'],
    });

    this.logger.log(`about to call this.getCustomerInvoice with id ${id}`);
    const invPdf = await this.getCustomerInvoice(id);

    this.logger.log('after call to notificationService.notifyEmail');
    this.logger.log(`orderUpdated ${JSON.stringify(orderUpdated, null, 2)}`);
    const custEmail: string = orderUpdated.customerOneTime.email;
    const subject: string = 'Your SaintlySinners Invoice';

    const body = this.invHtml(orderUpdated.orderLines); //`<html> Your invoice </html>`;
    const pdfBuffer = Buffer.from(invPdf);
    await this.notificationService.customerInvoiceEmail(
      custEmail,
      subject,
      body,
      pdfBuffer,
    );

    this.logger.log(
      `about to call sendOrderToXtrader with ${JSON.stringify(
        orderUpdated,
        null,
        2,
      )}`,
    );
    const xtraderStatus = await this.sendOrderToXtrader(orderUpdated);

    if (xtraderStatus.status === 'DOSuccess') {
      customerOrder.orderStatus = edcOrderStatusEnum.VENDOR_ORDERED;
      customerOrder.confirmOrder = xtraderStatus.value;
    } else if (xtraderStatus.status === 'DOFailed_insuf_funds') {
      // need to top up
      customerOrder.xtraderError = xtraderStatus.value;
      const email = process.env.ADMIN_EMAIL;
      //const text: 'paid'

      this.logger.log(
        `about to call notificationService.notifyEmail - insufficient funds`,
      );
      await this.notificationService.notifyEmail({
        email,
        subject: 'Insufficient funds for Xtrader Drop shipping',
        text: `Payment received for order: ${orderUpdated.orderNumber} Xtrader payment due ${customerOrder.xtraderError}`,
      });
    } else {
      // error with format of string
      customerOrder.xtraderError = 'Xtrader OrderAPI string error';
      const adminEmail = process.env.ADMIN_EMAIL;
      //const text: 'paid'

      this.logger.log(
        `about to call notificationService.notifyEmail - Incorrect API string`,
      );
      this.logger.log(`call notifyemail with admin email ${adminEmail}`);

      await this.notificationService.notifyEmail({
        email: adminEmail,
        subject: 'Error with Xtrader OrderAPI string',
        text: `Payment received for order: ${orderUpdated.orderNumber} - BUT error from Xtrader ${customerOrder.xtraderError}`,
      });
    }

    const vendorResult: UpdateResult = await this.custOrderRepo.update(
      id,
      customerOrder,
    );

    const vendoResultstatus =
      vendorResult.affected === 1
        ? MessageStatusEnum.SUCCESS
        : MessageStatusEnum.WARNING;

    this.logger.log(`vendoResult status ${vendoResultstatus}`);
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

  async getOrderStatus() {
    const vendorPass = process.env.XTRADER_VENDOR_PASS;

    const accountid = process.env.XTRADER_ACCOUNT_ID;

    const deliveryUrl = `https://www.xtrader.co.uk/catalog/orderstatusxml_auth.php?accountid=${accountid}&accountpass=${vendorPass}`;
    const { data } = await this.httpService.axiosRef.post<string>(deliveryUrl);
    return data;
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
        Key: 'logo.jpg',
      });
      const response = await this.s3.send(getCommand);
      const byteArray: Uint8Array | undefined =
        await response.Body.transformToByteArray();

      //TODO: set image on invoice
      // if(byteArray){
      //   const buffer = Buffer.from(byteArray)
      //   doc.image(buffer)

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
      order.customerOneTime.street;

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
      .text(
        `${order.customerOneTime.firstName} ${order.customerOneTime.lastName}`,
        50,
        this.customerInformationTop + 75,
      )
      .font('Helvetica')
      .text(address1, 50, this.customerInformationTop + 90)
      .text(order.customerOneTime.city, 50, this.customerInformationTop + 105)
      .text(order.customerOneTime.county, 50, this.customerInformationTop + 120)
      .text(
        order.customerOneTime.postCode,
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
      .text(item.xtraderProduct.model, 50, y)
      .text(item.xtraderProduct.name, 150, y)

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

  async getOrders(): Promise<CUSTOMER_ORDER[]> {
    this.logger.log('getOrders called');

    const orders = await this.custOrderRepo.find({ relations: ['customer'] });
    return orders;
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
}
