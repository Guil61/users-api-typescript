export interface CreateProductDto {
  name: string;
  code: string;
  description: string;
  userId?: number;
}

export interface ProductReponseDto {
  name: string;
  code: string;
  description: string;
  userId?: number;
}

export interface ProductAttributes {
  id?: number;
  name: string;
  code: string;
  description: string;
  userId?: number;
}
