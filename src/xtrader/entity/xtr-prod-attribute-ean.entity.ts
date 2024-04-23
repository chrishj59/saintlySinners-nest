import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { XTR_PRODUCT } from './xtr-product.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'xtr-prod-attribute-ean' })
export class XTR_PROD_ATTRIBUTE_EAN extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ean_code', type: 'varchar', length: 20 })
  code: string;

  @Column({ name: 'value', type: 'varchar', length: 30 })
  value: string;

  @ManyToOne(() => XTR_PRODUCT, (prod: XTR_PRODUCT) => prod.eans)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: XTR_PRODUCT;
  // @ManyToOne(() => XTR_PRODUCT, (prod: XTR_PRODUCT) => prod.eans)
  // @JoinColumn({ name: 'prod_id', referencedColumnName: 'id' })
  // product: XTR_PRODUCT;

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
