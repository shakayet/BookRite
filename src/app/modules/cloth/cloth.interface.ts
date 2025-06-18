export interface ICloth {
  title: string;
  size: 'S' | 'M' | 'L' | 'XL';
  color: string;
  price: number;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
