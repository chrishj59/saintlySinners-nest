import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { XTR_PRODUCT } from './xtr-product.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'xtr-brand' })
export class XTR_BRAND extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'image-name', type: 'varchar', length: 55, nullable: true })
  imageName: string;

  @OneToMany(() => XTR_PRODUCT, (product: XTR_PRODUCT) => product.brand)
  products: XTR_PRODUCT[];

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
