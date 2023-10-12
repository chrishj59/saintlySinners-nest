import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { EDC_PRODUCT } from './edc-product';
import { Exclude, Expose } from 'class-transformer';
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

  @ManyToOne(() => EDC_CATEGORY, (child) => child.parentCategory)
  parentCategory: EDC_CATEGORY;

  @Expose()
  @OneToMany(() => EDC_CATEGORY, (child: EDC_CATEGORY) => child.parentCategory)
  childCategories: EDC_CATEGORY[];

  @Column({ name: 'on_menu', type: 'boolean', default: false })
  onMenu: Boolean;

  @Column({ name: 'menu_item_level', type: 'int2', nullable: true })
  menulevel: number;

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
