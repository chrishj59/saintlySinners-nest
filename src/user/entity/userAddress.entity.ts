import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { AUTHJS_USER } from './authJsUser.entity';
import { CUSTOMER_ORDER } from 'src/customer-order/entities/customerOrder.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_address', schema: 'ss' })
@Index(['addressName', 'customer'], { unique: true })
export class USER_ADDRESS extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'default', type: 'boolean', default: false, nullable: true })
  default: boolean;

  @Column({ name: 'addressName', type: 'varchar', length: 40, nullable: true })
  addressName: string;

  @Column({ name: 'firstName', type: 'varchar', length: 40, nullable: true })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar', length: 40, nullable: true })
  lastName: string;

  @Column({ name: 'street', type: 'varchar', length: 40, nullable: true })
  street: string;

  @Column({ name: 'street2', type: 'varchar', length: 40, nullable: true })
  street2: string;

  @Column({ name: 'town', type: 'varchar', length: 40, nullable: true })
  town: string;

  @Column({ name: 'postCode', type: 'varchar', length: 40, nullable: true })
  postCode: string;

  @Column({ name: 'county', type: 'varchar', length: 40, nullable: true })
  county: string;

  @ManyToOne(() => AUTHJS_USER, (customer) => customer.addresses)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: AUTHJS_USER;

  @OneToOne(
    () => CUSTOMER_ORDER,
    (order: CUSTOMER_ORDER) => order.deliveryAddress,
  )
  order: CUSTOMER_ORDER;

  @Exclude()
  @DeleteDateColumn()
  deletedOn: Date;

  @Exclude()
  @CreateDateColumn()
  createdDate: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedDate: Date;

  @Exclude()
  @VersionColumn()
  version: number;
}
