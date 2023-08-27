import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'edc_product_file' })
export class EDC_PRODUCT_FILE {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'aws-key', type: 'varchar', length: '100' })
  public key: string;

  @Column({ name: 'location', nullable: true })
  public location: string;

  @ManyToOne(() => EDC_PRODUCT, (product: EDC_PRODUCT) => product.images)
  public product: EDC_PRODUCT;
}
