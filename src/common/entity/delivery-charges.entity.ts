import { Exclude } from 'class-transformer';
import { PRODUCT_VENDOR } from 'src/vendor/entity/vendor.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { Country } from './country.entity';
import { DeliveryCourier } from './delivery-courier.entity';
import { DELIVERY_REMOTE_LOCATION } from './delivery-remote-location';
import { boolean } from 'joi';
import { CUSTOMER_ORDER_DELIVERY } from 'src/customer-order/entities/customerOrderDelivery.entity';

@Entity({ name: 'delivery-charge' })
export class DeliveryCharge extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PRODUCT_VENDOR, (vendor) => vendor.deliveryCharges)
  @JoinColumn({ name: 'vendor_id', referencedColumnName: 'id' })
  vendor: PRODUCT_VENDOR;

  @ManyToOne(() => Country, (country) => country)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => DeliveryCourier, (courier) => courier.deliveryCharges)
  @JoinColumn({ name: 'courier_id' })
  courier: DeliveryCourier;

  @Column({ name: 'weight-uom', type: 'varchar' })
  uom: string;

  @Column({
    name: 'min-weight',
    type: 'numeric',
    precision: 5,
    scale: 3,
    nullable: true,
  })
  minWeight: number;

  @Column({
    name: 'max-weight',
    type: 'numeric',
    precision: 5,
    scale: 3,
    nullable: true,
  })
  maxWeight: number;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    nullable: true,
  })
  amount: number;

  @Column({
    name: 'vat_amount',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    nullable: true,
  })
  vatAmount: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    nullable: true,
  })
  totalAmount: number;

  @Column({ name: 'min-days', type: 'smallint', nullable: true })
  minDays: number;

  @Column({ name: 'max-days', type: 'smallint', nullable: true })
  maxDays: number;

  @Column({
    name: 'duration-description',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  durationDescription: string;

  @Column({ name: 'has_tracking', type: 'boolean', default: false })
  hasTracking: boolean;

  @Column({ name: 'has_lost_claim', type: 'boolean', default: false })
  hasLostClaim: boolean;

  @Column({ name: 'has_remote_charge', type: 'boolean', default: false })
  hasRemoteCharge: boolean;

  @OneToMany(
    () => DELIVERY_REMOTE_LOCATION,
    (remoteLocation) => remoteLocation.deliveryCharge,
  )
  remoteLocations: DeliveryCharge[];

  @OneToMany(
    () => CUSTOMER_ORDER_DELIVERY,
    (custOrderDelivery) => custOrderDelivery.deliveryCharge,
  )
  customerOrderDeliveries: CUSTOMER_ORDER_DELIVERY[];

  @Exclude()
  @CreateDateColumn()
  createdDate: Date;
  @Exclude()
  @UpdateDateColumn()
  updatedDate: Date;
  @DeleteDateColumn()
  deletedOn: Date;

  @Exclude()
  @VersionColumn()
  version: number;
}
