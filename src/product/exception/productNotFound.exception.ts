import { NotFoundException } from '@nestjs/common';

class ProductNotFoundException extends NotFoundException {
  constructor(productId: number) {
    super(`Post with id ${productId} not found`);
  }
}
