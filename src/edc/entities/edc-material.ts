import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('edc_material')
export class EDC_MATERIAL extends BaseEntity {
  @PrimaryColumn()
  id: number;
  @Column({ name: 'title', type: 'varchar' })
  title: string;
}
