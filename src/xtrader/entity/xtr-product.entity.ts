import { Exclude } from 'class-transformer';
import { XTR_PRODUCT_IMAGE_REMOTE_FILE } from 'src/remote-files/entity/stockFile.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { XTR_BRAND } from './xtr-brand.entity';
import { XTR_CATEGORY } from './xtr-Category.entity';
import { XTR_FEATURE } from './xtr-feature.entity';
import { XTR_PROD_ATTRIBUTE_EAN } from './xtr-prod-attribute-ean.entity';
import { XTR_PROD_ATTRIBUTE } from './xtr-prod-attribute.entity';
import { XtrProdStockStatusEnum } from '../enum/xtrProd-status.enum';

@Entity({ name: 'xtr-product', orderBy: { id: 'ASC' } })
export class XTR_PRODUCT extends BaseEntity {
  @PrimaryColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column({
    name: 'weight',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    nullable: true,
  })
  weight: number;

  @Column({
    name: 'product_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  name: string;

  @Column({ name: 'model', type: 'varchar', length: 100, nullable: true })
  model: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
    nullable: true,
  })
  goodsPrice: number;

  @Column({
    name: 'private_stock_price',
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
  })
  privateStockPrice: number;

  @Column({ name: 'case_size', type: 'int', nullable: true })
  caseSize: number;

  @Column({
    name: 'retail_price',
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
    nullable: true,
  })
  retailPrice: number;

  /** columns for link to xtr_prod_image */
  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_thumb_id' })
  public thumb?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_ximage_id' })
  public ximage?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_ximage2_id' })
  public ximage2?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_ximage3_id' })
  public ximage3?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_ximage4_id' })
  public ximage4?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_ximage5_id' })
  public ximage5?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_multi1_id' })
  public multi1?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_multi2_id' })
  public multi2?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_multi3_id' })
  public multi3?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_bigmulti1_id' })
  public bigmulti1?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_bigmulti2_id' })
  public bigmulti2?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @OneToOne(() => XTR_PRODUCT_IMAGE_REMOTE_FILE, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'image_bigmulti3_id' })
  public bigmulti3?: XTR_PRODUCT_IMAGE_REMOTE_FILE;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 10000,
    nullable: true,
  })
  description: string;

  @Column({
    name: 'description_html',
    type: 'varchar',
    length: 11000,
    nullable: true,
  })
  descriptionHtml: string;

  @Column({ name: 'ean', type: 'varchar', length: 50, nullable: true })
  ean: string;

  @Column({ name: 'prod_length', type: 'varchar', length: 50, nullable: true })
  length: string;

  @Column({ name: 'lube_type', type: 'varchar', length: 50, nullable: true })
  lubeType: string;

  @Column({ name: 'condom_safe', type: 'boolean', nullable: true })
  condomSafe: boolean;

  @Column({
    name: 'liquid_volume',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  liquidVolume: string;

  @Column({ name: 'number_of_pills', type: 'int', nullable: true })
  numberOfPills: number;

  @Column({ name: 'fastening', type: 'varchar', length: 50, nullable: true })
  fastening: string;

  // @Column({ name: 'washing', type: 'varchar', length: 20, nullable: true })
  // washdown: string;

  @Column({ name: 'insertable', type: 'varchar', length: 50, nullable: true })
  insertable: string;

  @Column({
    name: 'diameter',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  diameter: string;

  @Column({ name: 'harness_compatible', type: 'boolean', nullable: true })
  harnessCompatible: boolean;

  @Column({
    name: 'origin_circumference',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  originCircum: string;

  @Column({
    name: 'origin_diameter',
    type: 'varchar',

    nullable: true,
  })
  originDiam: string;

  @Column({
    name: 'circumference',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  circumference: string;

  @Column({ name: 'colour', type: 'varchar', length: 50, nullable: true })
  colour: string;

  @Column({ name: 'flexibility', type: 'varchar', length: 50, nullable: true })
  flexbility: string;

  @Column({ name: 'controller', type: 'varchar', length: 50, nullable: true })
  controller: string;

  @Column({ name: 'for-who', type: 'varchar', length: 50, nullable: true })
  forWho: string;

  @Column({ name: 'what-is-it', type: 'varchar', length: 50, nullable: true })
  whatIsIt: string;

  @Column({ name: 'for', type: 'varchar', length: 50, nullable: true })
  for: string;

  @Column({ name: 'motion', type: 'varchar', length: 50, nullable: true })
  motion: string;

  @ManyToOne(() => XTR_FEATURE, (feature) => feature.products)
  @JoinColumn({ name: 'feature_id', referencedColumnName: 'id' })
  feature: XTR_FEATURE;

  @Column({ name: 'misc', type: 'varchar', length: 50, nullable: true })
  misc: string;

  @Column({ name: 'waterproof', type: 'boolean', nullable: true })
  waterproof: boolean;

  @Column({ name: 'material', type: 'varchar', length: 50, nullable: true })
  material: string;

  @ManyToOne(() => XTR_BRAND, (brand: XTR_BRAND) => brand.products)
  @JoinColumn({ name: 'brand_id', referencedColumnName: 'id' })
  brand: XTR_BRAND;

  @Column({ name: 'style', type: 'varchar', length: 50, nullable: true })
  style: string;

  @Column({ name: 'washing', type: 'varchar', length: 50, nullable: true })
  washing: string;

  //TODO: link to attributes via ean
  //power, size, opening

  @Column({ name: 'power', type: 'varchar', length: 50, nullable: true })
  powerSource: string;

  @Column({ name: 'prod_size', type: 'varchar', length: 50, nullable: true })
  prodSize: string;

  @Column({ name: 'opening', type: 'varchar', length: 50, nullable: true })
  opening: string;

  @Column({
    name: 'stock_status',
    type: 'enum',
    enum: XtrProdStockStatusEnum,

    default: XtrProdStockStatusEnum.IN,
  })
  stockStatus: XtrProdStockStatusEnum;

  @OneToMany(
    () => XTR_PROD_ATTRIBUTE,
    (attr: XTR_PROD_ATTRIBUTE) => attr.product,
    {
      cascade: ['insert', 'update'],
    },
  )
  attributes: XTR_PROD_ATTRIBUTE[];

  @ManyToOne(() => XTR_CATEGORY, (category) => category.products)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: XTR_CATEGORY;

  @OneToMany(
    () => XTR_PROD_ATTRIBUTE_EAN,
    (ean: XTR_PROD_ATTRIBUTE_EAN) => ean.product,
    {
      cascade: ['insert', 'update'],
    },
  )
  eans: XTR_PROD_ATTRIBUTE_EAN[];

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
