import { DeliveryCharge } from 'src/common/entity/delivery-charges.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('customer_order_delivery')
export class CUSTOMER_ORDER_DELIVERY extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'delivery-cost',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  deliveryCost: number;

  @Column({
    name: 'shipping-module',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  shippingModule: string;

  @ManyToOne(() => DeliveryCharge, (DeliveryCharge) => DeliveryCharge)
  deliveryCharge: DeliveryCharge;
}
