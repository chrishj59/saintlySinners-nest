import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodmailer from 'nodemailer';
import { InvoiceEmailDto, NotifyEmailDto } from '../dtos/notify-email.dtos';
@Injectable()
export class NotificationService {
  constructor(private readonly configService: ConfigService) {}
  logger = new Logger('NotificationService');

  private readonly transporter = nodmailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    // auth: {
    //   user: process.env.SMTP_USER,
    //   pass: 'LYUfgi^6ySX8!ED7',
    // },
  });

  async notifyEmail({ email, subject, text }: NotifyEmailDto) {
    const fromEmail = this.configService.get('SMTP_USER');
    const toEmail = email;

    this.logger.log(`fromEmail ${fromEmail} to email ${toEmail}`);
    // this.logger.log(`sender email ${this.configService.get('SMTP_USER')}`);
    // this.logger.log(`user ${this.configService.get('SMTP_USER')}`);
    // this.logger.log(
    //   `clientId ${this.configService.get('GOOGLE_OAUTH_CLIENT_ID')}`,
    // );
    // this.logger.log(
    //   `clientSecret ${this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET')}`,
    // );
    // this.logger.log(
    //   `refreshToken ${this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN')}`,
    // );
    await this.transporter.sendMail({
      from: fromEmail, //this.configService.get('SMTP_USER'),
      to: toEmail, //email,
      subject: subject, // 'Saintly Sinners Order',
      text,
    });
  }

  async customerInvoiceEmail(
    email: string,
    subject: string,
    html: string,
    pdfData: Buffer,
  ) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject,
      html,
      attachments: [
        {
          filename: 'Invoice.pdf',
          contentType: 'application/pdf',
          content: pdfData,
        },
      ],
    });
    // TODO: send enail to customer
    // const mailOptions = {
    //   from: "XXXX",
    //   to: "XXXX",
    //   subject: `Subject`,
    //   attachments: [{
    //       filename: "Receipt.pdf",
    //       contentType: 'application/pdf', // <- You also can specify type of the document
    //       content: pdfBufferedFile // <- Here comes the buffer of generated pdf file
    //   }]
    // }
  }
}
