import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { LangIso639 } from './iso_639_lang.entity';

@Entity({ name: 'country_geo' })
export class Country extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'lang_code', nullable: true })
  langCode: string;

  @Column({ name: 'lang_name', nullable: true })
  langName: string;

  @Column()
  iso3: string;

  @Column()
  iso2: string;

  @Column({ name: 'numeric_code' })
  numericCode: string;

  @Column({ name: 'phone_code' })
  phoneCode: string;

  @Column()
  capital: string;

  @Column()
  currency: string;

  @Column({ name: 'currency_symbol' })
  currencySymbol: string;

  @Column({ nullable: true })
  tld: string;

  @Column()
  region: string;

  @Column({ name: 'sub_region' })
  subRegion: string;

  @Column()
  native: string;

  @Column()
  timezones: string;

  @Column({ name: 'latitude', type: 'decimal', precision: 8, scale: 5 })
  lat: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 8, scale: 5 })
  lng: number;

  // @Column({
  //   type: 'geometry',
  //   nullable: true,
  //   spatialFeatureType: 'Point',
  //   srid: 4326,
  // })
  // location: Geometry;

  @Column()
  emoji: string;

  @Column()
  emojiu: string;

  @ManyToMany(() => LangIso639, (lang) => lang)
  languages: LangIso639[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;

  // setLocation(lat: number, lng: number): void {
  //   this.location = {
  //     type: 'Point',
  //     coordinates: [lng, lat],
  //   };
  // }
}
