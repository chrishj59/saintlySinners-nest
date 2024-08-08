import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

    try {
      await transporter.sendMail({
        from: `SaintlySinners <${process.env.ADMIN_EMAIL}>`,
        to: email,
        subject,
        text,
      });
    } catch (e: any) {
      this.logger.warn(
        `Could not send notifyEmail email ${JSON.stringify(e, null, 2)}`,
      );
      throw new BadRequestException(`Could not send notify email to ${email}`);
    }
  }

  async customerOrderStatusUpdateEmail(
    email: string,
    subject: string,
    html: string,
  ) {
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
    try {
      await transporter.sendMail({
        from: `SaintlySinners <${process.env.ADMIN_EMAIL}>`,
        to: email,
        subject,
        html,
      });
    } catch (e: any) {
      this.logger.warn(
        `Could not send customerOrderStatus email ${JSON.stringify(
          e,
          null,
          2,
        )}`,
      );
      throw new BadRequestException(
        `Could not send Order status update email to ${email}`,
      );
    }
  }

  async customerInvoiceEmail(
    email: string,
    subject: string,
    html: string,
    pdfData: Buffer,
  ): Promise<string> {
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

    try {
      const status = await transporter.sendMail({
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
      });

      return status.messageId;
    } catch (e: any) {
      this.logger.warn(
        `Notification service Could not send CustomerInvoceEmail email ${JSON.stringify(
          e,
          null,
          2,
        )}`,
      );
      throw new BadRequestException(
        `Could not send customer invoice email to ${email}`,
      );
    }
  }
}
