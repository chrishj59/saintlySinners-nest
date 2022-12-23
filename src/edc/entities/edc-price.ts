import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { EDC_PRODUCT } from './edc-product';

@Entity('edc_price')
export class EDC_PRICE extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'currency_iso3' })
  currencyCode: string;

  @Column({
    name: 'b2b-retail-price',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  b2b: number;

  @Column({
    name: 'b2b-sale-price',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  b2bSale: number;

  @Column({
    name: 'b2c-retail-price',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  b2c: number;

  @Column({
    name: 'vat-rate-nl',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  valRateNl: number;

  @Column({
    name: 'vat-rate-de',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  valRateDe: number;

  @Column({
    name: 'vat-rate-fr',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  valRatefr: number;
  @Column({
    name: 'vat-rate-uk',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
  })
  valRateUk: number;

  @Column({ name: 'discount-available', type: 'char', length: 1 })
  discountAvailable: string;

  @OneToMany(() => EDC_PRODUCT, (product) => product.brand)
  products: EDC_PRODUCT[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
