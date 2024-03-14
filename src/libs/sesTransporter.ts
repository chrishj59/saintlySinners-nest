import * as nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const sesTransporter = nodemailer.createTransport({
  SES: { ses, aws },
});

export { sesTransporter };
