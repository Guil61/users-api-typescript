import { get } from "http";
import { CreateProductDto, ProductReponseDto } from "../database/dtos/ProductDtos";
import Product from "../database/models/Product";

export class ProductService {
  async findById() {}

  async create(data: CreateProductDto): Promise <ProductReponseDto>{
    const product = await Product.create(data);

    const productData = product.get();

    return {
      name: productData.name,
      code: productData.code,
      description: productData.description,
      userId: productData.userId
    }
  }

  async update() {}

  async delete() {}

  async findAll() {}
}
