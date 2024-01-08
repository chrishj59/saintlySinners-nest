import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { XTR_ATTRIBUTE_VALUE } from './xtr-attribute-value.entity';
import { XTR_PRODUCT } from './xtr-product.entity';

@Entity({ name: 'xtr-prod-attribute' })
export class XTR_PROD_ATTRIBUTE extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 10 })
  name: string;

  @ManyToMany(() => XTR_ATTRIBUTE_VALUE)
  @JoinTable()
  attributeValues: XTR_ATTRIBUTE_VALUE[];

  @ManyToOne(() => XTR_PRODUCT, (prod) => prod.attributes)
  product: XTR_PRODUCT;

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
