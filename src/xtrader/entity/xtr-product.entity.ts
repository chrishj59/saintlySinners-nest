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

  @Column({ name: 'product_name', type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ name: 'model', type: 'varchar', length: '30', nullable: true })
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
    length: 1000,
    nullable: true,
  })
  description: string;

  @Column({
    name: 'description_html',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  descriptionHtml: string;

  @Column({ name: 'ean', type: 'varchar', length: 13, nullable: true })
  ean: string;

  // @Column({ name: 'ean-extra-small', type: 'varchar', length: 13, nullable: true })
  // eanSmall: string;

  // @Column({ name: 'ean-small', type: 'varchar', length: 13, nullable: true })
  // eanExtraSmall: string;

  // @Column({ name: 'ean-medium', type: 'varchar', length: 13, nullable: true })
  // eanMedium: string;

  // @Column({ name: 'ean-large', type: 'varchar', length: 13, nullable: true })
  // eanLarge: string;

  // @Column({ name: 'ean-extra-large', type: 'varchar', length: 13, nullable: true })
  // eanExtraLarge: string;

  // @Column({ name: 'ean-Xlarge', type: 'varchar', length: 13, nullable: true })
  // eanXLarge: string;

  // @Column({ name: 'ean-x-large', type: 'varchar', length: 13, nullable: true })
  // eanXLarge: string;

  // @Column({ name: 'ean-XXlarge', type: 'varchar', length: 13, nullable: true })
  // eanXXLarge: string;

  // @Column({ name: 'ean-sm', type: 'varchar', length: 13, nullable: true })
  // eanSm: string;

  // @Column({ name: 'ean-m', type: 'varchar', length: 13, nullable: true })
  // eanM: string;

  // @Column({ name: 'ean-ml', type: 'varchar', length: 13, nullable: true })
  // eanMl: string;

  // @Column({ name: 'ean-lxl', type: 'varchar', length: 13, nullable: true })
  // eanLxl: string;
  // @Column({ name: 'ean-xs', type: 'varchar', length: 13, nullable: true })
  // eanXs: string;

  // @Column({ name: 'ean-xss', type: 'varchar', length: 13, nullable: true })
  // eanXss: string;

  // @Column({ name: 'ean-xxl', type: 'varchar', length: 13, nullable: true })
  // eanXxl: string;

  // @Column({ name: 'ean-xxxl', type: 'varchar', length: 13, nullable: true })
  // eanXxxl: string;

  // @Column({ name: 'ean-xxxxl', type: 'varchar', length: 13, nullable: true })
  // eanXxxxl: string;

  // @Column({ name: 'ean-xxlxxxl', type: 'varchar', length: 13, nullable: true })
  // eanXxlxxxl: string;

  // @Column({ name: 'ean-80bm', type: 'varchar', length: 13, nullable: true })
  // ean80bm: string;

  // @Column({ name: 'ean-85bl', type: 'varchar', length: 13, nullable: true })
  // ean85bl: string;

  // @Column({ name: 'ean-85cl', type: 'varchar', length: 13, nullable: true })
  // ean85cl: string;

  // @Column({ name: 'ean-85dl', type: 'varchar', length: 13, nullable: true })
  // ean85dl: string;

  // @Column({ name: 'ean-75bs', type: 'varchar', length: 13, nullable: true })
  // ean75bs: string;

  // @Column({ name: 'ean-80cm', type: 'varchar', length: 13, nullable: true })
  // ean80cm: string;

  // @Column({ name: 'ean-90dxl', type: 'varchar', length: 13, nullable: true })
  // ean90dxl: string;

  // @Column({ name: 'ean-90exl', type: 'varchar', length: 13, nullable: true })
  // ean90exl: string;

  // @Column({ name: 'ean-95d2xl', type: 'varchar', length: 13, nullable: true })
  // ean95d2xl: string;

  // @Column({ name: 'ean-95e2xl', type: 'varchar', length: 13, nullable: true })
  // ean95e2xl: string;

  // @Column({ name: 'ean-95f2xl', type: 'varchar', length: 13, nullable: true })
  // ean95f2xl: string;

  // @Column({ name: 'ean-32b', type: 'varchar', length: 13, nullable: true })
  // ean32b: string;

  // @Column({ name: 'ean-32c', type: 'varchar', length: 13, nullable: true })
  // ean32c: string;

  // @Column({ name: 'ean-34a', type: 'varchar', length: 13, nullable: true })
  // ean34a: string;

  // @Column({ name: 'ean-34b', type: 'varchar', length: 13, nullable: true })
  // ean34b: string;

  // @Column({ name: 'ean-34c', type: 'varchar', length: 13, nullable: true })
  // ean34c: string;

  // @Column({ name: 'ean-34d', type: 'varchar', length: 13, nullable: true })
  // ean34d: string;

  // @Column({ name: 'ean-32d', type: 'varchar', length: 13, nullable: true })
  // ean32d: string;

  // @Column({ name: 'ean-36b', type: 'varchar', length: 13, nullable: true })
  // ean36b: string;

  // @Column({ name: 'ean-36c', type: 'varchar', length: 13, nullable: true })
  // ean36c: string;

  // @Column({ name: 'ean-36bm', type: 'varchar', length: 13, nullable: true })
  // ean36bm: string;

  // @Column({ name: 'ean-38bl', type: 'varchar', length: 13, nullable: true })
  // ean38bl: string;

  // @Column({ name: 'ean-34bs', type: 'varchar', length: 13, nullable: true })
  // ean34bs: string;

  // @Column({ name: 'ean-36', type: 'varchar', length: 13, nullable: true })
  // ean36: string;

  // @Column({ name: 'ean-38cxl', type: 'varchar', length: 13, nullable: true })
  // ean38cxl: string;

  // @Column({ name: 'ean-38', type: 'varchar', length: 13, nullable: true })
  // ean38: string;

  // @Column({ name: 'ean-40', type: 'varchar', length: 13, nullable: true })
  // ean40: string;

  @Column({ name: 'prod_length', type: 'varchar', length: 10, nullable: true })
  length: string;

  @Column({ name: 'lube_type', type: 'varchar', length: 20, nullable: true })
  lubeType: string;

  @Column({ name: 'condom_safe', type: 'boolean', nullable: true })
  condomSafe: boolean;

  @Column({
    name: 'liquid_volume',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  liquidVolume: number;

  @Column({
    name: 'liquid_volume_uom',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  liquidVolumeUom: string;

  @Column({ name: 'number_of_pills', type: 'int', nullable: true })
  numberOfPills: number;

  @Column({ name: 'fastening', type: 'varchar', length: 50, nullable: true })
  fastening: string;

  // @Column({ name: 'washing', type: 'varchar', length: 20, nullable: true })
  // washdown: string;

  @Column({ name: 'insertable', type: 'boolean', nullable: true })
  insertableToy: boolean;

  @Column({
    name: 'diameter',
    type: 'decimal',
    precision: 2,
    scale: 2,
    nullable: true,
  })
  diameter: number;

  @Column({ name: 'diameter_uom', type: 'varchar', length: 10, nullable: true })
  diameterUom: string;

  @Column({ name: 'harness_compatible', type: 'boolean', nullable: true })
  harnessCompatible: boolean;

  @Column({
    name: 'origin_circumference',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  originCircum: number;

  @Column({
    name: 'origin_circumference_uom',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  originCircumUom: string;

  @Column({
    name: 'origin_diameter',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  originDiam: number;

  @Column({
    name: 'origin_diameter_uom',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  originDiamUom: string;

  @Column({
    name: 'circumference',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  circumference: number;

  @Column({
    name: 'circumference_uom',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  circumferenceUom: string;

  @Column({ name: 'colour', type: 'varchar', length: 10, nullable: true })
  colour: string;

  @Column({ name: 'flexibility', type: 'varchar', length: 20, nullable: true })
  flexbility: string;

  @Column({ name: 'controller', type: 'varchar', length: 50, nullable: true })
  controller: string;

  @Column({ name: 'for-who', type: 'varchar', length: 20, nullable: true })
  forWho: string;

  @Column({ name: 'what-is-it', type: 'varchar', length: 20, nullable: true })
  whatIsIt: string;

  @Column({ name: 'for', type: 'varchar', length: 10, nullable: true })
  for: string;

  @Column({ name: 'motion', type: 'varchar', length: 10, nullable: true })
  motion: string;

  @ManyToOne(() => XTR_FEATURE, (feature) => feature.products)
  @JoinColumn({ name: 'feature_id', referencedColumnName: 'id' })
  feature: XTR_FEATURE;

  @Column({ name: 'misc', type: 'varchar', length: 50, nullable: true })
  misc: string;

  @Column({ name: 'waterproof', type: 'boolean', nullable: true })
  waterproof: boolean;

  @Column({ name: 'material', type: 'varchar', length: 20, nullable: true })
  material: string;

  @ManyToOne(() => XTR_BRAND, (brand: XTR_BRAND) => brand.products)
  @JoinColumn({ name: 'brand_id', referencedColumnName: 'id' })
  brand: XTR_BRAND;

  @Column({ name: 'style', type: 'varchar', length: 20, nullable: true })
  style: string;

  @Column({ name: 'washing', type: 'varchar', length: 50, nullable: true })
  washing: string;

  //TODO: link to attributes via ean
  //power, size, opening

  @Column({ name: 'power', type: 'varchar', length: 25, nullable: true })
  powerSource: string;

  @Column({ name: 'prod_size', type: 'varchar', length: 30, nullable: true })
  prodSize: string;

  @Column({ name: 'opening', type: 'varchar', length: 20, nullable: true })
  opening: string;

  // @OneToMany(
  //   () => XTR_PROD_ATTRIBUTE_EAN,
  //   (ean: XTR_PROD_ATTRIBUTE_EAN) => ean.product,
  // )
  // eans: XTR_PROD_ATTRIBUTE_EAN[];

  @OneToMany(() => XTR_PROD_ATTRIBUTE, (attr: XTR_PROD_ATTRIBUTE) => attr, {
    cascade: ['insert', 'update'],
  })
  attributes: XTR_PROD_ATTRIBUTE[];

  @ManyToOne(() => XTR_CATEGORY, (category) => category.products)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: XTR_CATEGORY;

  @ManyToMany(
    () => XTR_PROD_ATTRIBUTE_EAN,
    (ean: XTR_PROD_ATTRIBUTE_EAN) => ean.products,
  )
  @JoinTable({
    name: 'xtr-prod-eans',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ean_id', referencedColumnName: 'id' },
  })
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
