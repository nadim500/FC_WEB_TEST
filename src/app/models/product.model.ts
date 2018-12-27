export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  state: boolean;
  constructor(obj?: any) {
    this.id = obj && obj.id || null;
    this.name = obj && obj.name || null;
    this.description = obj && obj.description || null;
    this.price = obj && typeof obj.price === 'number' && obj.price > 0 && obj.price || 0;
    this.stock = obj && typeof obj.stock === 'number' && obj.stock > 0 && obj.stock || 0;
    this.state = (this.price > 0 && this.stock > 0);
  }
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  state: boolean;
}
