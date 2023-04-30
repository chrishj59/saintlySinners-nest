import { type } from 'os';
import { Country } from 'src/common/entity/country.entity';
import { PublicFile } from 'src/remote-files/entity/publicFile.entity';
import { USER } from 'src/user/entity/user.entity';
import { PRODUCT_VENDOR } from 'src/vendor/entity/vendor.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { CUSTOMER_ORDER_LINE } from './customerOrderLine.entity';

@Entity({ name: 'order' })
export class CUSTOMER_ORDER extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PRODUCT_VENDOR, (vendor) => vendor.orders)
  @JoinColumn({ name: 'vendor_id', referencedColumnName: 'id' })
  vendor: PRODUCT_VENDOR;

  @OneToMany(
    () => CUSTOMER_ORDER_LINE,
    (line: CUSTOMER_ORDER_LINE) => line.order,
  )
  lines: CUSTOMER_ORDER_LINE[];

  @Column({ name: 'stripe_sesson' })
  stripeSession: string;

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
    () => CUSTOMER_ORDER_LINE,
    (line: CUSTOMER_ORDER_LINE) => line.order,
  )
  orderLines: CUSTOMER_ORDER_LINE[];

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public invoicePdf?: PublicFile;

  @DeleteDateColumn()
  deletedOn: Date;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
