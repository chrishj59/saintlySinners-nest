import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { XTR_PRODUCT } from './xtr-product.entity';
import { AUTHJS_USER } from 'src/user/entity/authJsUser.entity';

@Entity({ name: 'xtr-product-review', schema: 'ss', orderBy: { id: 'ASC' } })
export class XTR_PRODUCT_REVIEW extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rating', type: 'integer', nullable: true })
  rating: number;

  @Column({ name: 'title', type: 'varchar', length: 150, nullable: true })
  title: string;

  @Column({ name: 'boby', type: 'text', nullable: true })
  body: string;

  @ManyToOne(() => XTR_PRODUCT, (product) => product.reviews)
  @JoinColumn({ name: 'productId' })
  product: XTR_PRODUCT;

  @ManyToOne(() => AUTHJS_USER, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: AUTHJS_USER;

  @Exclude()
  @DeleteDateColumn()
  deletedOn: Date;

  @CreateDateColumn()
  createdDate: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedDate: Date;

  @Exclude()
  @VersionColumn()
  version: number;
}
