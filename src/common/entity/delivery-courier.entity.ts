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

  @OneToMany(() => DeliveryCharge, (charge) => charge.courier)
  deliveryCharges: DeliveryCharge[];

  @Column({
    name: 'delivery-module',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
