import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('countries-language-map')
export class CountryLangMap extends BaseEntity {
  @Column({ name: 'country-name' })
  countryName: string;

  @PrimaryColumn({ name: 'country-alpha2', type: 'varchar', length: '2' })
  countryCode: string;

  @PrimaryColumn({ name: 'lang-alpha3B', type: 'varchar', length: '3' })
  langCode: string;

  @Column({ name: 'sequence' })
  sequence: number;
}
