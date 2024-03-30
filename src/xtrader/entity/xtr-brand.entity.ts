import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { XTR_PRODUCT } from './xtr-product.entity';
import { Exclude } from 'class-transformer';
import { XTR_BRAND_IMAGE_REMOTE_FILE } from 'src/remote-files/entity/xtraderBrandFile.entity';

@Entity({ name: 'xtr-brand' })
export class XTR_BRAND extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'image_name', type: 'varchar', length: 50, nullable: true })
  imageName: string;

  @OneToOne(() => XTR_BRAND_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  public image?: XTR_BRAND_IMAGE_REMOTE_FILE;

  @Column({ name: 'favourite', type: 'boolean', default: false })
  isFavourite: boolean;

  @Column({ name: 'ranking', type: 'int', default: 0 })
  ranking: number;

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
