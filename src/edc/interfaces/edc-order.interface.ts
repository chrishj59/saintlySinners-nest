export type Customerdetails = {
  email: string;
  apikey: string;
  output: string;
};

export type Receiver = {
  name: string;
  street: string;
  house_nr?: number;
  postalcode: string;
  city: string;
  country: number;
  phone: string;
  consumer_amount?: string;
  consumer_amount_currency?: string;
  attachment?: string;
  own_ordernumber: string;
};

export type Product = {
  artnr: string[];
};

type OrderDetails = {
  customerdetails: Customerdetails;
  receiver: Receiver;
  products: Product;
};
export interface EdcOrderInterface {
  orderdetails: OrderDetails;
}
