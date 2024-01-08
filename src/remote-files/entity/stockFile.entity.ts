import { Exclude } from 'class-transformer';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import { XTR_CATEGORY } from 'src/xtrader/entity/xtr-Category.entity';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: 'xtr_stock_image' })
export class XTR_PRODUCT_IMAGE_REMOTE_FILE {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'category', type: 'varchar', length: 50 })
  category: string;

  @Column({ name: 'aws-key', type: 'varchar', length: '100' })
  public key: string;

  @Column({ name: 'file_type', type: 'varchar', length: 20, nullable: true })
  public fileType: string;

  // @Column({ name: 'location', nullable: true })
  // public location: string;

  // @OneToOne(() => XTR_CATEGORY, (cat: XTR_CATEGORY) => cat.image)
  // cat: XTR_CATEGORY;
  @OneToOne(() => XTR_PRODUCT, (thumb: XTR_PRODUCT) => thumb.thumb)
  thumb: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (ximage: XTR_PRODUCT) => ximage.ximage)
  ximage: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (ximage2: XTR_PRODUCT) => ximage2.ximage2)
  ximage2: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (ximage3: XTR_PRODUCT) => ximage3.ximage3)
  ximage3: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (ximage4: XTR_PRODUCT) => ximage4.ximage4)
  ximage4: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (ximage5: XTR_PRODUCT) => ximage5.ximage5)
  ximage5: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (multi1: XTR_PRODUCT) => multi1.multi1)
  multi1: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (multi2: XTR_PRODUCT) => multi2.multi2)
  multi12: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (multi3: XTR_PRODUCT) => multi3.multi3)
  multi13: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (bigmulti1: XTR_PRODUCT) => bigmulti1.bigmulti1)
  bigmulti1: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (bigmulti2: XTR_PRODUCT) => bigmulti2.bigmulti2)
  bigmulti2: XTR_PRODUCT;

  @OneToOne(() => XTR_PRODUCT, (bigmulti3: XTR_PRODUCT) => bigmulti3.bigmulti3)
  bigmulti3: XTR_PRODUCT;

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
