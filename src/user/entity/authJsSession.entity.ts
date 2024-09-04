import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Session', schema: 'auth' })
export class AUTHJS_SESSION extends BaseEntity {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'sessionToken', type: 'text' })
  sessionToken: string;

  @Column({ name: 'userId', type: 'text' })
  userId: string;

  @Column({ name: 'expires', type: 'time without time zone' })
  expires: Date;
}
