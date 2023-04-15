import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { USER } from '../../user/entity/user.entity';

@Entity('order')
export class ORDER extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_date', type: 'date' })
  public orderDate: Date;

  @Column({ name: 'stripe_pay_id', type: 'varchar' })
  public stripeId: string;

  @Column()
  public name: string;

  @Column()
  public street: string;

  @Column()
  public town: string;

  @Column()
  public county: string;

  @Column({ name: 'country_iso3', type: 'char', length: 3 })
  public countryIso3: string;

  @Column({ name: 'country_edc', type: 'int' })
  public countryEdc: number;

  @ManyToOne(() => USER, (user: USER) => user.orders)
  customer: USER;

  @DeleteDateColumn()
  public deletedAt: Date;

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
