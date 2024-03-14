import { SESClient } from '@aws-sdk/client-ses';

const REGION = 'eu-west-2';
const sesClient = new SESClient({ region: REGION });
export { sesClient };
