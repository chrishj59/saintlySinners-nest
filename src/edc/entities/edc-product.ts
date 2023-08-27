import { CUSTOMER_ORDER_LINE } from 'src/customer-order/entities/customerOrderLine.entity';
import { EDC_PRODUCT_FILE } from 'src/remote-files/entity/productFile.entity';
import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
  VirtualColumn,
} from 'typeorm';

import { EDC_BATTERY } from './edc-battery';
import { EDC_BRAND } from './edc-brand';
import { EDC_CATEGORY } from './edc-category.entity';
import { EDC_PRICE } from './edc-price';
import { EDC_PRODUCT_BULLET } from './edc-product-bullet-point.entity';
import { EDC_PRODUCT_RESTRICTION } from './edc-product-restrictions.entity';
import { EDC_PROPERTY } from './edc-property';
import { EDC_VARIANT } from './edc-variant';

@Entity('edc_product')
export class EDC_PRODUCT extends BaseEntity {
  @PrimaryColumn()
  id: number;
  @Index('edc_product_artnr_idx')
  @Column({ name: 'product_number' })
  artnr: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'decription' })
  description: string;

  @Column({ name: 'case_count', type: 'integer' })
  caseCount: number;

  @Column({ name: 'added_date', type: 'date' })
  date: Date;

  @Column({ name: 'mod_date', type: 'date' })
  modifyDate: Date;

  @ManyToOne(() => EDC_BRAND, (brand) => brand.products)
  brand: EDC_BRAND;

  @ManyToOne(() => EDC_PRICE, (price) => price.products)
  price: EDC_PRICE;

  @ManyToOne(() => EDC_BATTERY, (battery) => battery)
  batteryInfo: EDC_BATTERY;

  @ManyToOne(() => EDC_CATEGORY, (cat) => cat.defaultProducts)
  defaultCategory: EDC_CATEGORY;

  @ManyToMany(() => EDC_CATEGORY)
  @JoinTable({
    name: 'edc_product_category',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  newCategories: EDC_CATEGORY[];

  @ManyToMany(() => EDC_PROPERTY)
  @JoinTable({
    name: 'product_property',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'property_id', referencedColumnName: 'id' },
  })
  // @OneToMany((_type) => EDC_PROPERTY, (prop) => prop.products)
  properties: EDC_PROPERTY[];

  @OneToMany((_type) => EDC_VARIANT, (variant) => variant.edcProd)
  variants: EDC_VARIANT[];

  @Column({ name: 'currency', default: 'EUR', type: 'char', length: 3 })
  currency: string;

  @Column({
    name: 'b_2_b',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  b2b: number;

  @Column({
    name: 'b_2_c',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  b2c: number;

  @Column({
    name: 'vat_rate_nl',
    type: 'decimal',
    precision: 4,
    scale: 2,
    default: 0,
  })
  vatRateNl: number;

  @Column({
    name: 'vat_rate_de',
    type: 'decimal',
    precision: 4,
    scale: 2,
    default: 0,
  })
  vatRateDe: number;

  @Column({
    name: 'vat_rate_fr',
    type: 'decimal',
    precision: 4,
    scale: 2,
    default: 0,
  })
  vatRateFr: number;

  @Column({
    name: 'vat_rate_uk',
    type: 'decimal',
    precision: 4,
    scale: 2,
    default: 0,
  })
  vatRateUk: number;

  @Column({ name: 'discount', type: 'char', length: 1, default: 'N' })
  discount: string;

  @Column({
    name: 'min_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  minPrice: number;

  @Column({ name: 'measure_weight', type: 'int', nullable: true })
  weight: number;

  @Column({ name: 'measure_packaging', type: 'varchar', nullable: true })
  packaging: string;

  @Column({ name: 'material', type: 'varchar', nullable: true })
  material: string;

  @Column({ name: 'popularity', type: 'int', nullable: true })
  popularity: number;

  @OneToMany(() => EDC_PRODUCT_FILE, (file: EDC_PRODUCT_FILE) => file.product)
  public images: EDC_PRODUCT_FILE[];

  @Column({ name: 'country-code', type: 'char', length: 3, default: '' })
  countryCode: string;

  @OneToMany(() => EDC_PRODUCT_BULLET, (bullet) => bullet.edcProd)
  @JoinColumn({ name: 'product_id' })
  bullets: EDC_PRODUCT_BULLET[];

  @ManyToMany(() => EDC_PRODUCT_RESTRICTION)
  @JoinTable({
    name: 'product_restriction_map',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'restiction_id', referencedColumnName: 'id' },
  })
  restrictions: EDC_PRODUCT_RESTRICTION[];

  @Column({ name: 'hs-code', nullable: true })
  hsCode: string;

  @Column({ name: 'battery-required', type: 'boolean', nullable: true })
  batteryRequired: boolean;

  @OneToMany(
    () => CUSTOMER_ORDER_LINE,
    (line: CUSTOMER_ORDER_LINE) => line.edcProduct,
  )
  orderLines: CUSTOMER_ORDER_LINE[];

  @DeleteDateColumn()
  deletedOn: Date;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;

  @AfterLoad()
  updateB2C() {
    this.b2c = this.b2c * (1 + this.vatRateNl / 100);
  }
}
