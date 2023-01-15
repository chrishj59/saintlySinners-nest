import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { EDC_PRODUCT } from './edc-product';
import { EDC_PROP_VALUE } from './edc-prop-value';

@Entity('edc_property')
@Index(['propertyId', 'productId'])
export class EDC_PROPERTY extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  propertyId: number;

  @Column({ nullable: true })
  productId: number;

  @Column({ name: 'prop-title', type: 'varchar' })
  propTitle: string;

  @ManyToMany(() => EDC_PROP_VALUE)
  @JoinTable({
    name: 'prop_prop_value',
    joinColumn: { name: 'prop_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'prop_value_id', referencedColumnName: 'id' },
  })
  values: EDC_PROP_VALUE[];

  @ManyToMany(() => EDC_PRODUCT)
  products: EDC_PRODUCT[];

  // @ManyToOne(() => EDC_PRODUCT, (prod) => prod.properties)
  // @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  // products: EDC_PRODUCT[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
