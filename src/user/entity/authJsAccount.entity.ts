import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Account', schema: 'auth' })
export class AUTHJS_ACCOUNT extends BaseEntity {
  @Column({ name: 'id', type: 'text' })
  @PrimaryColumn()
  id: string;

  @Column({ name: 'userId', type: 'text' })
  userId: string;

  @Column({ name: 'provider', type: 'text' })
  provider: string;

  @Column({ name: 'providerAccount', type: 'text' })
  providerAccount: string;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refresh_token: string;

  @Column({ name: 'access_token', type: 'text', nullable: true })
  access_token: string;

  @Column({ name: 'expires_at', type: 'integer', nullable: true })
  expires_at: number;

  @Column({ name: 'token_type', type: 'text', nullable: true })
  token_type: string;

  @Column({ name: 'scope', type: 'text', nullable: true })
  scope: string;

  @Column({ name: 'id_token', type: 'text', nullable: true })
  id_token: string;

  @Column({ name: 'session_state', type: 'text', nullable: true })
  session_state: string;
}
