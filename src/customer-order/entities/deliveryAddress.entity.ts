import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CUSTOMER_ORDER } from './customerOrder.entity';
import { combineLatestWith } from 'rxjs';

@Entity({ name: 'delivery_address' })
export class DELIVERY_ADDRESS extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 30 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 30 })
  lastName: string;
  @Column({ name: 'street', type: 'varchar', length: 20 })
  street: string;
  @Column({ name: 'street2', type: 'varchar', length: 20, nullable: true })
  street2: string;
  @Column({ name: 'house_number', type: 'varchar', length: 5, nullable: true })
  houseNumber: number;

  @Column({ name: 'city', type: 'varchar', length: 20 })
  city: string;
  @Column({ name: 'county', type: 'varchar', length: 20 })
  county: string;

  @Column({ name: 'country', type: 'int' })
  country: number; // EDC country code

  @Column({ name: 'post_code', type: 'varchar', length: 10 })
  postCode: string;
  @Column({ name: 'telephone', type: 'varchar', length: 10, nullable: true })
  telephone: string;
  @Column({ name: 'email', type: 'varchar', length: 50 })
  email: string;

  @OneToOne(() => CUSTOMER_ORDER, (order) => order.address)
  order: CUSTOMER_ORDER;
}
