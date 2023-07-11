import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodmailer from 'nodemailer';
import { NotifyEmailDto } from '../dtos/notify-email.dtos';
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
  });

  async notifyEmail({ email, text }: NotifyEmailDto) {
    this.logger.log(`called notifyEmail with ${email} ${text}`);
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Saintly Sinners EDC Payment due',
      text,
    });
  }

  async customerInvoiceEmail() {
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
