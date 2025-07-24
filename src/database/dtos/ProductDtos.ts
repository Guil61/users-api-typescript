export interface CreateProductDto {
  name: string;
  code: string;
  description: string;
  userId?: number;
}


export interface UpdateProductDto {
  id?: number;
  name: string;
  code: string;
  description: string;
  newUserMail: string;
  userId?: number;
}

export interface ProductReponseDto {
  id: number;
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
