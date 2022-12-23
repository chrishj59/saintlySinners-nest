import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { EDC_PRODUCT } from './edc-product';

@Entity({ name: 'edc_product-bullet-point' })
export class EDC_PRODUCT_BULLET extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'seq', generated: 'increment' })
  seq: number;

  @Column({ name: 'description' })
  description: string;

  @ManyToOne(() => EDC_PRODUCT, (prod) => prod.bullets)
  @JoinColumn({ name: 'product_id' })
  edcProd: EDC_PRODUCT;

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
