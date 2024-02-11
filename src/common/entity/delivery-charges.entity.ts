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

  @Column({ name: 'charge', type: 'decimal', precision: 8, scale: 2 })
  amount: number;

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
