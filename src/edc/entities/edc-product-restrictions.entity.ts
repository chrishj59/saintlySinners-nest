import { BaseEntity, Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ProductRestrictionEnum } from '../../enums/product-restriction.enum';
import { EDC_PRODUCT } from './edc-product';

@Entity({ name: 'edc_product-restrictions' })
@Index(['restriction', 'restricted'], { unique: true })
export class EDC_PRODUCT_RESTRICTION extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    name: 'location_display',
    type: 'enum',
    enum: ProductRestrictionEnum,
  })
  restriction: ProductRestrictionEnum;

  @Column({ name: 'resctricted', type: 'boolean' })
  restricted: boolean;

  @ManyToMany(() => EDC_PRODUCT)
  products: EDC_PRODUCT;
}
