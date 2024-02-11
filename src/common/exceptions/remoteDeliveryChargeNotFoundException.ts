import { NotFoundException } from '@nestjs/common';

class RemoteDeliveryChargeNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Remote Delivery charge with id ${id} not found`);
  }
}

export default RemoteDeliveryChargeNotFoundException;
