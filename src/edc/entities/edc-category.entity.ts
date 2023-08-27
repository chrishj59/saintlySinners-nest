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
import { Exclude } from 'class-transformer';
@Entity('edc-category')
export class EDC_CATEGORY extends BaseEntity {
  @PrimaryColumn({ name: 'id' })
  id: number;

  @Column({ name: 'title' })
  title: string;

  @OneToMany(() => EDC_PRODUCT, (product) => product.defaultCategory)
  defaultProducts: EDC_PRODUCT[];

  @ManyToMany(() => EDC_PRODUCT)
  products: EDC_PRODUCT[];

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
