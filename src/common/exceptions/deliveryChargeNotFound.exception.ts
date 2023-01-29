import { NotFoundException } from '@nestjs/common';

class DeliveryChargeNotFoundException extends NotFoundException {
  constructor(chargeId: string) {
    super(`Delivery charge with id ${chargeId} not found`);
  }
}

export default DeliveryChargeNotFoundException;
