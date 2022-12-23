import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { EDC_PRODUCT } from './edc-product';

@Entity('variant')
export class EDC_VARIANT extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'variant-type' })
  type: string;

  @Index()
  @Column({ name: 'sub-atrnr' })
  subArtNr: string;

  @Column({ name: 'ean', type: 'bigint' })
  ean: number;

  @Column({ name: 'in-stock', type: 'char', length: 1 })
  inStock: string;

  @Column({ name: 'stock-estimate', type: 'integer', nullable: true })
  stockEstimate: number;

  @Column({ name: 'restock-week-num', nullable: true, type: 'integer' })
  restockWeekNr: number;

  @Column({ name: 'custom-product', nullable: true, type: 'char', length: 1 })
  customProduct: string;

  @Column({ name: 'size-title', type: 'varchar', nullable: true })
  sizeTitle: string;

  @Column({ name: 'discontinued', type: 'char', length: 1, nullable: true })
  discontinued: string;

  @ManyToOne(() => EDC_PRODUCT, (prod: EDC_PRODUCT) => prod.variants)
  edcProd: EDC_PRODUCT;

  // @ManyToOne(() => Post, (post: Post) => post.comments)
  // public post: Post;

  @Column({ name: 'discontinued-quantity', type: 'integer', nullable: true })
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
