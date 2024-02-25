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
import { CUSTOMER_ORDER } from './customerOrder.entity';

@Entity({ name: 'customer-order-product' })
export class CUSTOMER_ORDER_PRODUCT extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'model', type: 'varchar', length: 20 })
  model: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({
    name: 'attribute_name',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  attributeName: string;

  @Column({
    name: 'attribute_value',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  attributeValue: string;

  @ManyToOne(() => CUSTOMER_ORDER, (order: CUSTOMER_ORDER) => order.products)
  order: CUSTOMER_ORDER;

  @DeleteDateColumn()
  deletedOn: Date;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
