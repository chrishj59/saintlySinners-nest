import { CUSTOMER_ORDER } from 'src/customer-order/entities/customerOrder.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'customer_invoice_pdf' })
export class CUSTOMER_INVOICE_PDF {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'aws-key' })
  public key: string;

  @OneToOne(() => CUSTOMER_ORDER, (order: CUSTOMER_ORDER) => order.invoicePdf)
  order: CUSTOMER_ORDER;
}
