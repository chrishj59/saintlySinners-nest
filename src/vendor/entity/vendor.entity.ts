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

import { DeliveryCharge } from '../../common/entity/delivery-charges.entity';

@Entity({ name: 'prod-vendor' })
export class Vendor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => DeliveryCharge, (delivery) => delivery.vendor)
  deliveryCharges: DeliveryCharge[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
