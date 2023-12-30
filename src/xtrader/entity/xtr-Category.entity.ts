import { Exclude, Expose } from 'class-transformer';
import { XTR_CATEGORY_IMAGE_REMOTE_FILE } from 'src/remote-files/entity/xtrCategoryFile.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: 'xtr-category' })
export class XTR_CATEGORY extends BaseEntity {
  @PrimaryColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column({ name: 'xtr-category-name', type: 'varchar', length: '40' })
  catName: string;

  @OneToOne(() => XTR_CATEGORY_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  public image?: XTR_CATEGORY_IMAGE_REMOTE_FILE;

  @Expose()
  @ManyToOne(() => XTR_CATEGORY, (child) => child.parentCategory)
  parentCategory: XTR_CATEGORY;

  @Expose()
  @OneToMany(() => XTR_CATEGORY, (child: XTR_CATEGORY) => child.parentCategory)
  childCategories: XTR_CATEGORY[];

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
