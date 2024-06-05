import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { XTR_PROD_ATTRIBUTE } from './xtr-prod-attribute.entity';
import { XtrProdStockStatusEnum } from '../enum/xtrProd-status.enum';

@Entity({ name: 'xtr-attribute-value' })
export class XTR_ATTRIBUTE_VALUE extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'attribute_value_id',
    type: 'integer',
    default: 0,
    nullable: true,
  })
  atrributeValueId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @Column({
    name: 'price_adjustment',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  priceAdjustment: string;

  @Column({ name: 'ean', type: 'varchar', length: 13, nullable: true })
  ean: string;

  @Column({
    name: 'stock_status',
    type: 'enum',
    enum: XtrProdStockStatusEnum,
    nullable: true,
    default: XtrProdStockStatusEnum.IN,
  })
  stockStatus: XtrProdStockStatusEnum;

  @ManyToOne(() => XTR_PROD_ATTRIBUTE, (attr) => attr)
  @JoinColumn({ name: 'attribute_id', referencedColumnName: 'id' })
  attribute: XTR_PROD_ATTRIBUTE;

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
