import { Exclude } from 'class-transformer';
import { Vendor } from 'src/vendor/entity/vendor.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { Country } from './country.entity';
import { DeliveryCourier } from './delivery-courier.entity';

@Entity({ name: 'delivery-charge' })
export class DeliveryCharge extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.deliveryCharges)
  @JoinColumn({ name: 'vendor_id', referencedColumnName: 'id' })
  vendor: Vendor;

  @ManyToOne(() => Country, (country) => country)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => DeliveryCourier, (courier) => courier.deliveryCharges)
  @JoinColumn({ name: 'courier_id' })
  courier: DeliveryCourier;

  @Column({ name: 'weight-uom', type: 'varchar' })
  uom: string;

  @Column({ name: 'min-weight', type: 'integer' })
  minWeight: number;

  @Column({ name: 'max-weight', type: 'integer' })
  maxWeight: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  amount: number;

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
