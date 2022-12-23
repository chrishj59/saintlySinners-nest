import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { EDC_PRODUCT } from './edc-product';

@Entity('edc-category')
export class EDC_NEW_CATEGORY extends BaseEntity {
  @PrimaryColumn({ name: 'id' })
  id: number;

  @Column({ name: 'title' })
  title: string;

  @OneToMany(() => EDC_PRODUCT, (product) => product.defaultCategory)
  defaultProducts: EDC_PRODUCT[];

  @ManyToMany(() => EDC_PRODUCT)
  products: EDC_PRODUCT[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
