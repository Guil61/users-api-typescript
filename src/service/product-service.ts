import { get } from "http";
import {
  CreateProductDto,
  ProductReponseDto,
  UpdateProductDto,
} from "../database/dtos/ProductDtos";
import Product from "../database/models/Product";
import {
  InternalError,
  NotFoundError,
  UnauthorizedError,
  UserNotOwnerError,
} from "../handler/apiErrors";
import User from "../database/models/User";
import { where } from "sequelize";

export class ProductService {
  async findById(id: number): Promise<ProductReponseDto> {
    const product = await Product.findByPk(id);

    if (!product) throw new NotFoundError("Produto não encontrado");

    return {
      id: product.id,
      name: product.name,
      code: product.code,
      description: product.description,
      userId: product.userId,
    };
  }

  async create(data: CreateProductDto): Promise<ProductReponseDto> {
    const product = await Product.create(data);

    const productData = product.get();

    return {
      id: productData.id!,
      name: productData.name,
      code: productData.code,
      description: productData.description,
      userId: productData.userId,
    };
  }

  async update(id: number, data: UpdateProductDto): Promise<ProductReponseDto> {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new NotFoundError("Produto não encontrado");
    }

    if (product.userId != data.userId) {
      throw new UserNotOwnerError("Usuário não é o responsável pelo produto.");
    }

    if (data.name) {
      product.name = data.name;
    }

    if (data.code) {
      product.code = data.code;
    }

    if (data.description) {
      product.description = data.description;
    }

    if (data.newUserMail) {
      const newOwner = await User.findOne({
        where: { email: data.newUserMail },
      });

      if (!newOwner) {
        throw new Error("Usuário não encontrado");
      }

      product.userId = newOwner.id;
    }

    await product.save();

    return {
      id: product.id,
      name: product.name,
      code: product.code,
      description: product.description,
      userId: product.userId,
    };
  }

  async delete(id: number, userId: number): Promise<string> {
    const product = await Product.findByPk(id);

    if (userId != product?.userId) {
      throw new UserNotOwnerError("Usuário não responsável pelo produto.");
    }

    await product.destroy();

    return "produto deletado";
  }

  async findAll() {
    try {
      return await Product.findAll();
    } catch (error) {
      throw new InternalError("Falha ao listar usuários: " + error);
    }
  }
}
