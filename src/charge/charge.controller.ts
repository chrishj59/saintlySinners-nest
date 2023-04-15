import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/authorisation/authorisation.guard';
import { StripeService } from 'src/stripe/stripe.service';

import CreateChargeDto from './dtos/createCharge.dto';

@Controller('charge')
export class ChargeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(AuthorizationGuard)
  async createCharge(@Body() charge: CreateChargeDto, @Req() request: any) {
    await this.stripeService.charge(
      charge.amount,
      charge.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }
}
