export interface Product {
  id: number;
  name: string;
  description: string;
  mrp_price: number;
  price: number;
  image?: string;
}

export interface ProductResponse {
  product: Product;
  image_url: string;
}
