import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity({ name: 'country_city' })
export class CountryCity extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'state_code' })
  stateCode: string;

  @Column({ name: 'country_code' })
  countryCode: string;

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

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
