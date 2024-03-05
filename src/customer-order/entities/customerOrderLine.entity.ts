import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { CUSTOMER_ORDER } from './customerOrder.entity';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';

@Entity('customer_order_line')
export class CUSTOMER_ORDER_LINE extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @ManyToOne(() => CUSTOMER_ORDER, (order: CUSTOMER_ORDER) => order.lines)
  order: CUSTOMER_ORDER;

  @ManyToOne(() => EDC_PRODUCT, (prod: EDC_PRODUCT) => prod.orderLines)
  edcProduct: EDC_PRODUCT;

  @ManyToOne(() => XTR_PRODUCT, (prod: XTR_PRODUCT) => prod.orderLines)
  xtraderProduct: XTR_PRODUCT;

  @Column({ name: 'unit_price', type: 'double precision' })
  price: string;

  @Column({ name: 'amount', type: 'double precision' })
  lineTotal: string;

  @Column({ name: 'product_ref' })
  prodRef: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'attrib_name', type: 'varchar', length: 20, nullable: true })
  attributeName: string;

  @Column({ name: 'attrib_value', type: 'varchar', length: 50, nullable: true })
  attributeValue: string;

  @Column({ name: 'vat_rate', type: 'double precision' })
  vatRate: number;

  @Column({ name: 'edc_stock_status', type: 'character', nullable: true })
  edcStockStatus: string;

  @Column({
    name: 'arrival_week_nr',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
