import { Exclude } from 'class-transformer';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import { XTR_CATEGORY } from 'src/xtrader/entity/xtr-Category.entity';
import { Category } from '../../edc/dtos/add-product.dto';
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

@Entity({ name: 'xtr_category_image' })
export class XTR_CATEGORY_IMAGE_REMOTE_FILE {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'aws-key', type: 'varchar', length: '100' })
  public key: string;

  @Column({ name: 'location', nullable: true })
  public location: string;

  @OneToOne(() => XTR_CATEGORY, (cat: XTR_CATEGORY) => cat.image)
  cat: XTR_CATEGORY;

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
