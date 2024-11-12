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

import { DeliveryCharge } from './delivery-charges.entity';

@Entity({ name: 'delivery-courier' })
export class DeliveryCourier extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({
    name: 'shipping-module',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  shippingModule: string;

  @Column({ name: 'cutoff-time', type: 'time', nullable: true })
  cutoffTime: string;

  @OneToMany(() => DeliveryCharge, (charge) => charge.courier)
  deliveryCharges: DeliveryCharge[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
