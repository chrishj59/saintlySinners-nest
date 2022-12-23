import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity('edc_measure')
export class EDC_MEASURE extends BaseEntity {
  @PrimaryColumn({ name: 'id' })
  id: number;

  @Column({ name: 'measure_name', type: 'varchar', nullable: true })
  measureName: string;

  @Column({ name: 'measure_unit', type: 'varchar', nullable: true })
  measureUnit: string;

  @Column({
    name: 'measure-length',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
    nullable: true,
  })
  measureLength: number;

  @Column({
    name: 'height',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
    nullable: true,
  })
  height: number;

  @Column({
    name: 'internal-length',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
    nullable: true,
  })
  internalLength: number;

  @Column({
    name: 'insertionDepth',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
    nullable: true,
  })
  insertionDepth: number;

  @Column({
    name: 'min-diameter',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
    nullable: true,
  })
  minDiameter: number;

  @Column({
    name: 'max-diameter',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
    nullable: true,
  })
  maxDiameter: number;

  @Column({
    name: 'internal-diameter',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
    nullable: true,
  })
  internalDiameter: number;

  @Column({
    name: 'outer-diameter',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
    nullable: true,
  })
  outerDiameter: number;

  @Column({
    name: 'weight',
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: 0,
    nullable: true,
  })
  weight: number;

  @Column({ name: 'packaging', type: 'varchar', nullable: true })
  packaging: string;

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
