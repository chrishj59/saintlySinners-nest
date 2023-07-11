// EDC order response {
//  "result": "OK",
//  "ordernumber": "EG230709011474",
//  "own_ordernumber": "190",
//  "total_incl_vat": "19.99",
//  "vatlow": "0.00",
//  "vathigh": "1.30",
//  "shippingcosts_excl_vat": "6.20",
//  "subtotal_excl_vat": "10.32",
//  "used_prepaid": "N",
//  "products": [
//    {
//      "artnr": "05097280000",
//      "stock": "Y",
//      "price": "10.32",
//      "vat": "2.17",
//      "vatclass": "1.21",
//      "quantity": 1,
//      "weeknr": ""
//    }
//  ]
//  }
type body = {
  result: string;
  ordernumber: string;
  own_ordernumber: string;
  total_incl_vat: string;
  vatlow: string;
  vathigh: string;
  shippingcosts_excl_vat: string;
  subtotal_excl_vat: string;
  used_prepaid: string;
};
type product = {
  artnr: string;
  stock: string;
  price: string;
  vat: string;
  vatclass: string;
  quantity: number;
  weeknr: string;
};

export type EdcSaveOrderReponse = {
  result: string;
  ordernumber: string;
  own_ordernumber: string;
  total_incl_vat: string;
  vatlow: string;
  vathigh: string;
  shippingcosts_excl_vat: string;
  subtotal_excl_vat: string;
  used_prepaid: string;
  products: product[];
};
