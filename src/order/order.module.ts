import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ORDER } from './entity/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([ORDER])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
