import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { XTR_PROD_ATTRIBUTE } from './xtr-prod-attribute.entity';

@Entity({ name: 'xtr-attribute-value' })
export class XTR_ATTRIBUTE_VALUE extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @Column({
    name: 'price-adjustment',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
  })
  priceAdjustment: number;

  @Column({ name: 'in-stock', type: 'boolean', default: true, nullable: true })
  inStock: boolean;

  @ManyToMany(() => XTR_PROD_ATTRIBUTE, (attr) => attr)
  attributes: XTR_PROD_ATTRIBUTE[];

  @Exclude()
  @DeleteDateColumn()
  deletedOn: Date;

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
