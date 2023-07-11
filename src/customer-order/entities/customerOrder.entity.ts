import { type } from 'os';
import { edcOrderStatusEnum } from 'src/edc/enums/Edc-order-status.enum';
import { Country } from 'src/common/entity/country.entity';
import { CUSTOMER_INVOICE_PDF } from 'src/remote-files/entity/customerInvoiceFile.entity';
import { USER } from 'src/user/entity/user.entity';
import { PRODUCT_VENDOR } from 'src/vendor/entity/vendor.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { CUSTOMER_ORDER_LINE } from './customerOrderLine.entity';

@Entity({ name: 'customer_order' })
export class CUSTOMER_ORDER extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number' })
  @Generated('increment')
  orderNumber: number;

  @ManyToOne(() => PRODUCT_VENDOR, (vendor) => vendor.orders)
  @JoinColumn({ name: 'vendor_id', referencedColumnName: 'id' })
  vendor: PRODUCT_VENDOR;

  @OneToMany(
    () => CUSTOMER_ORDER_LINE,
    (line: CUSTOMER_ORDER_LINE) => line.order,
  )
  lines: CUSTOMER_ORDER_LINE[];

  @Column({ name: 'stripe_sesson', nullable: true })
  stripeSession: string;

  @Column({
    name: 'order_status',
    type: 'enum',
    enum: edcOrderStatusEnum,
    nullable: true,
    default: edcOrderStatusEnum.PENDING,
  })
  orderStatus: edcOrderStatusEnum;

  @Column({ name: 'oneTimeCustomer', default: false })
  oneTimeCustomer: boolean;

  @Column({ name: 'title', nullable: true })
  customerTitle: string;

  @Column({ name: 'customer_name', nullable: true })
  name: string;

  @Column({ name: 'house_number', type: 'integer', nullable: true })
  houseNumber: number;

  @Column({ name: 'house_name', type: 'varchar', length: 20, nullable: true })
  houseName: string;

  @Column({ name: 'street', type: 'varchar', length: 50, nullable: true })
  street: string;

  @Column({ name: 'city', type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ name: 'county', type: 'varchar', length: 50, nullable: true })
  county: string;

  @ManyToOne(() => Country, (country: Country) => country.orders)
  country: Country;

  @Column({ name: 'postCode', type: 'varchar', length: 10, nullable: true })
  postCode: string;

  @Column({ name: 'zip', type: 'smallint', nullable: true })
  zip: number;

  @Column({ name: 'telephone', type: 'varchar', length: 20, nullable: true })
  telphone: string;

  @Column({ name: 'goods_amount', type: 'double precision' })
  goodsValue: number;

  @Column({ name: 'tax', type: 'double precision' })
  tax: number;

  @Column({ name: 'total', type: 'double precision' })
  total: number;

  @Column({ name: 'currency_code', type: 'char', length: 3 })
  currencyCode: string;

  @ManyToOne(() => USER, (customer: USER) => customer.orders)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: USER;

  @OneToMany(
    (_type) => CUSTOMER_ORDER_LINE,
    (line: CUSTOMER_ORDER_LINE) => line.order,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  orderLines: CUSTOMER_ORDER_LINE[];

  @OneToOne(() => CUSTOMER_INVOICE_PDF, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  public invoicePdf?: CUSTOMER_INVOICE_PDF;

  @Column({
    name: 'vendor-order-number',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  vendOrderNumber: string;

  @Column({
    name: 'vendor-goods-cost',
    type: 'double precision',
    nullable: true,
  })
  vendGoodCost: number;

  @Column({
    name: 'vendor-delivery_cost',
    type: 'double precision',
    nullable: true,
  })
  vendDelCost: number;

  @Column({ name: 'vendor-vat', type: 'double precision', nullable: true })
  vendVat: number;

  @Column({ name: 'vendor-total', type: 'double precision', nullable: true })
  vendTotalPayable: number;

  @DeleteDateColumn()
  deletedOn: Date;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
