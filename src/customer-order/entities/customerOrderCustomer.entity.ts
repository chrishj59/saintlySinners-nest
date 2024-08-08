import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { CUSTOMER_ORDER_DELIVERY } from './customerOrderDelivery.entity';

@Entity({ name: 'one-time-customer' })
export class ONE_TIME_CUSTOMER extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 10, nullable: true })
  title: string;

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'street-1', type: 'varchar', length: 64 })
  street: string;

  @Column({ name: 'street-2', type: 'varchar', length: 35, nullable: true })
  street2: string;

  @Column({ name: 'city', type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ name: 'county', type: 'varchar', length: 50, nullable: true })
  county: string;

  //TODO: many to one link to country

  @Column({ name: 'post_code', type: 'varchar', length: 10 })
  postCode: string;

  @Column({ name: 'telephone', type: 'varchar', length: 20 })
  telephone: string;

  @Column({ name: 'email', type: 'varchar', length: 50 })
  email: string;

  @DeleteDateColumn()
  deletedOn: Date;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
