import { Exclude } from 'class-transformer';
import { XTR_BRAND } from 'src/xtrader/entity/xtr-brand.entity';
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

@Entity({ name: 'xtr_brand_image' })
export class XTR_BRAND_IMAGE_REMOTE_FILE {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'aws-key', type: 'varchar', length: '100' })
  public key: string;

  @OneToOne(() => XTR_BRAND, (brand: XTR_BRAND) => brand.image)
  public brand: XTR_BRAND;

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
