import { CUSTOMER_ORDER } from 'src/customer-order/entities/customerOrder.entity';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'User', schema: 'auth' })
export class AUTHJS_USER extends BaseEntity {
  @PrimaryColumn({ name: 'id', type: 'text' })
  id: string;

  @Column({ name: 'name', type: 'text', nullable: true })
  name: string;

  @Column({ name: 'email', type: 'text', nullable: true })
  email: string;

  @Column({
    name: 'emailVerified',
    type: 'timestamp without time zone',
    nullable: true,
  })
  emailVerified: string;

  @Column({ name: 'image', type: 'text', nullable: true })
  image: string;

  @Column({ name: 'county', type: 'varchar', length: 40, nullable: true })
  county: string;

  @Column({ name: 'displayName', type: 'varchar', length: 40, nullable: true })
  displayName: string;

  @Column({ name: 'firstName', type: 'varchar', length: 40, nullable: true })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar', length: 40, nullable: true })
  lastName: string;

  @Column({ name: 'mobPhone', type: 'varchar', length: 40, nullable: true })
  mobPhone: string;

  @Column({ name: 'postCode', type: 'varchar', length: 40, nullable: true })
  postCode: string;

  @Column({ name: 'street', type: 'varchar', length: 40, nullable: true })
  street: string;

  @Column({ name: 'street2', type: 'varchar', length: 40, nullable: true })
  street2: string;

  @Column({ name: 'title', type: 'varchar', length: 40, nullable: true })
  title: string;

  @Column({ name: 'town', type: 'varchar', length: 40, nullable: true })
  town: string;

  @Column({ name: 'birthDate', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ name: 'role', type: 'varchar', length: 40, nullable: true })
  role: string;

  @ManyToMany(() => XTR_PRODUCT, (prod) => prod.likes)
  likedProds: XTR_PRODUCT[];

  @Column({ name: 'likes', type: 'int', default: 0, nullable: true })
  likes: number;

  @Column({ name: 'stripe_customer_id', nullable: true })
  public stripeCustomerId: string;

  @OneToMany(() => CUSTOMER_ORDER, (order: CUSTOMER_ORDER) => order.customer)
  orders: CUSTOMER_ORDER;
}
