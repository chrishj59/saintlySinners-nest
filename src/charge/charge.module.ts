import { Module } from '@nestjs/common';

import { StripeModule } from '../stripe/stripe.module';
import { ChargeController } from './charge.controller';

@Module({
  controllers: [ChargeController],
  imports: [StripeModule],
})
export class ChargeModule {}
