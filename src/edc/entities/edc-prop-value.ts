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

import { EDC_PROPERTY } from './edc-property';

@Entity('edc_prop-value')
export class EDC_PROP_VALUE extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'title', type: 'varchar', nullable: true })
  title: string;

  @Column({ name: 'unit', type: 'varchar', nullable: true })
  unit: string;

  @Column({ name: 'magnitude', type: 'integer', nullable: true })
  magnitude: number;

  @ManyToMany(() => EDC_PROPERTY)
  properties: EDC_PROPERTY[];

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @VersionColumn()
  version: number;
}
