import { DeliveryCharge } from 'src/common/entity/delivery-charges.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { CUSTOMER_ORDER } from './customerOrder.entity';

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
    name: 'delivery-vat',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  deliveryVat: number;

  @Column({
    name: 'delivery-total',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  deliverTotal: number;

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

  @OneToOne(() => CUSTOMER_ORDER, (order: CUSTOMER_ORDER) => order.delivery)
  order: CUSTOMER_ORDER;

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
