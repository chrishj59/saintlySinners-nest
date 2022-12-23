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

  @OneToMany(() => EDC_PRODUCT, (product) => product.brand)
  products: EDC_PRODUCT[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
