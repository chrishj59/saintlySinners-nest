import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { CountryLangMap } from './country-lang-map.entity';

@Entity('iso_639_lang')
export class LangIso639 extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'alfa3_b', unique: true }) // english code
  alpha3B: string;
  @Column({ name: 'alfa3_t', nullable: true }) // terminological native language code
  alpha3T: string;

  @Column()
  alpha2: string;

  @Column({ name: 'english_name' })
  english: string;

  @Column({ name: 'french_name' })
  french: string;

  @OneToMany((_type) => CountryLangMap, (country) => country.langCode)
  langCountries: CountryLangMap[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
