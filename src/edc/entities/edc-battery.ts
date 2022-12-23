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

@Entity({ name: 'edc_battery' })
export class EDC_BATTERY extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'char', length: 1 })
  included: string;

  @Column({ type: 'integer' })
  quantity: number;

  @OneToMany(() => EDC_PRODUCT, (product) => product.brand)
  products: EDC_PRODUCT[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
