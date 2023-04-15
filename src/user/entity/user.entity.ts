import { ORDER } from 'src/order/entity/order.entity';
import { PublicFile } from 'src/remote-files/entity/publicFile.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('User')
export class USER extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'first_name' })
  firstname: string;

  @Column({ name: 'family_name' })
  familyName: string;

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile;

  @Column()
  public stripeCustomerId: string;

  @OneToMany(() => ORDER, (ord: ORDER) => ord.customer)
  orders: ORDER[];
}
