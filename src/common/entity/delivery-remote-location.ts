import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { DeliveryCharge } from './delivery-charges.entity';
import { boolean } from 'joi';

@Entity({ name: 'delivery-remote_location' })
@Index(['postCode', 'deliveryCharge'], { unique: true })
export class DELIVERY_REMOTE_LOCATION extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'post_code', type: 'varchar', length: 5 })
  postCode: string;

  @Column({ name: 'charge', type: 'numeric', scale: 2, precision: 10 })
  remoteCharge: number;

  @Column({ name: 'surcharge', type: 'boolean', default: false })
  surcharge: boolean;

  @Column({ name: 'days', type: 'int', nullable: true })
  days: number;

  @ManyToOne(() => DeliveryCharge, (charge) => charge)
  @JoinColumn({ name: 'delivery-charge_id' })
  deliveryCharge: DeliveryCharge;

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
