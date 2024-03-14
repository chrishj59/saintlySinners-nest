import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { InvoiceEmailDto, NotifyEmailDto } from '../dtos/notify-email.dtos';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
// import { MailerModuleOption } from 'src/interface/mailerModuleOption';

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService, // private readonly mailerOptions: MailerModuleOption,
  ) {}
  logger = new Logger('NotificationService');

  async notifyEmail({ email, subject, text }: NotifyEmailDto) {
    this.logger.log(
      `notifyEmail called with email ${email} subject: ${subject} `,
    );

    const ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });

    this.logger.log('call transporter.sendMail');
    transporter.sendMail(
      {
        from: `SaintlySinners <${process.env.ADMIN_EMAIL}>`,
        to: email,
        subject,
        text,
      },
      (err, info) => {
        this.logger.log(`error ${JSON.stringify(err, null, 2)}`);

        this.logger.log(
          `messageid: ${JSON.stringify(info.messageId, null, 2)}`,
        );
      },
    );
    this.logger.warn('after this.transporter.sendMail ');
  }

  async customerInvoiceEmail(
    email: string,
    subject: string,
    html: string,
    pdfData: Buffer,
  ) {
    this.logger.log(
      `customerInvoiceEmail called with pdfData length ${pdfData.byteLength}`,
    );
    const ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: 'eu-west-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });

    this.logger.log('call transporter.sendMail');
    transporter.sendMail(
      {
        from: `SaintlySinners <${process.env.ADMIN_EMAIL}>`,
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
      },
      (err, info) => {
        this.logger.log(`error ${JSON.stringify(err, null, 2)}`);
        this.logger.log(`envelope ${JSON.stringify(info.envelope, null, 2)}`);
        this.logger.log(
          `customer email messageid: ${JSON.stringify(
            info.messageId,
            null,
            2,
          )}`,
        );
      },
    );
  }
}
