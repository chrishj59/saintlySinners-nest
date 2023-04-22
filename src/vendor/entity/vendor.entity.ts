import { DeliveryCharge } from 'src/common/entity/delivery-charges.entity';
import { CUSTOMER_ORDER } from 'src/customer-order/entities/customerOrder.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: 'prod-vendor' })
export class PRODUCT_VENDOR extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => CUSTOMER_ORDER, (order: CUSTOMER_ORDER) => order.vendor)
  orders: CUSTOMER_ORDER[];

  @OneToMany(() => DeliveryCharge, (delivery) => delivery.vendor)
  deliveryCharges: DeliveryCharge[];

  // @OneToMany(
  //   () => CustomerOrderLine,
  //   (custOrderLine: CustomerOrderLine) => custOrderLine.productVendor,
  // )
  // customerOrderLines: CustomerOrderLine[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
