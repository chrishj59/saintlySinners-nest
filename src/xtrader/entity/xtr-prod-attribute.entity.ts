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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { XTR_ATTRIBUTE_VALUE } from './xtr-attribute-value.entity';
import { XTR_PRODUCT } from './xtr-product.entity';

@Entity({ name: 'xtr-prod-attribute' })
export class XTR_PROD_ATTRIBUTE extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'attribute_id', type: 'int' })
  attributeId: number;

  @Column({ name: 'name', type: 'varchar', length: 10 })
  name: string;

  @ManyToMany(() => XTR_ATTRIBUTE_VALUE)
  @JoinTable({
    name: 'xtr_attribute_value_map',
    joinColumn: { name: 'attribute_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'attribute_value_id',
      referencedColumnName: 'id',
    },
  })
  attributeValues: XTR_ATTRIBUTE_VALUE[];

  @ManyToOne(() => XTR_PRODUCT, (prod) => prod.attributes)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
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
