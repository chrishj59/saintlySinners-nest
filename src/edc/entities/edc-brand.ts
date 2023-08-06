import { BrandCategoryEnum } from 'src/enums/Brand-category.enum';
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
import { Exclude } from 'class-transformer';

@Entity('edc_brand')
export class EDC_BRAND extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'title' })
  title: string;
  @Column({
    name: 'category_type',
    type: 'enum',
    enum: BrandCategoryEnum,
    nullable: true,
  })
  categoryType: BrandCategoryEnum;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'integer', nullable: true, default: 6 })
  catLevel: number;

  @Column({ name: 'aws_key', type: 'varchar', length: 30, nullable: true })
  awsKey: string;

  @Column({ name: 'on_home_page', type: 'boolean', default: false })
  onHomePage: boolean;

  @OneToMany(() => EDC_PRODUCT, (product) => product.brand)
  products: EDC_PRODUCT[];

  @CreateDateColumn()
  @Exclude()
  createdDate: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedDate: Date;

  @Exclude()
  @VersionColumn()
  version: number;
}
