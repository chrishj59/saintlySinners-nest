import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity({ name: 'country_state' })
export class CountryState extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'country_code' })
  countryCode: string;

  @Column({ name: 'state_code' })
  stateCode: string;

  @Column()
  type: string;

  @Column({
    name: 'latitude',
    type: 'decimal',
    precision: 8,
    scale: 5,
    nullable: true,
  })
  lat: number;
  @Column({
    name: 'longitude',
    type: 'decimal',
    precision: 8,
    scale: 5,
    nullable: true,
  })
  lng: number;

  // @Column({
  //   type: 'geometry',
  //   nullable: true,
  //   spatialFeatureType: 'Point',
  //   srid: 4326,
  // })
  // location: Geometry;

  // setLocation(lat: number, lng: number): void {
  //   this.location = {
  //     type: 'Point',
  //     coordinates: [lng, lat],
  //   };
  // }

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
