import {
  CreateProductDto,
  ProductReponseDto,
  UpdateProductDto,
} from '../database/dtos/ProductDtos';
import Product from '../database/models/Product';
import {
  InternalError,
  NotFoundError,
  UnauthorizedError,
  UserNotOwnerError,
} from '../handler/apiErrors';
import User from '../database/models/User';
import { redis } from '../database/config/redis';

export class ProductService {
  async findById(id: number): Promise<ProductReponseDto> {
    const cacheKey = `product:${id}:product`;

    try {
      const cacheProduct = await redis.get(cacheKey);
      if (cacheProduct) {
        console.log(`Cache encontrado para chave: ${cacheKey}`);
        return JSON.parse(cacheProduct);
      }

      const product = await Product.findByPk(id);

      if (!product) throw new NotFoundError('Produto não encontrado');

      await redis.set(cacheKey, JSON.stringify(product.toJSON()), {
        EX: 300,
      });
      console.log(`Cache CRIADO para chave: ${cacheKey}`);

      return {
        id: product.id,
        name: product.name,
        code: product.code,
        description: product.description,
        userId: product.userId,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao buscar produto');
    }
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
      throw new NotFoundError('Produto não encontrado');
    }

    if (product.userId != data.userId) {
      throw new UserNotOwnerError('Usuário não é o responsável pelo produto.');
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
        throw new Error('Usuário não encontrado');
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
    const cacheKeyId = `product:${id}:product`;
    const isProductCached = await redis.get(cacheKeyId);
    const productListCacheKey = `user:${userId}:products`;

    if (isProductCached) {
      console.log('Chave encontrada para prdouto');
    }

    const product = await Product.findByPk(id);

    if (userId != product?.userId) {
      throw new UserNotOwnerError('Usuário não responsável pelo produto.');
    }

    await product.destroy();

    await redis.del(cacheKeyId);
    console.log('Cache deletado para produto de id ', id);

    await redis.del(productListCacheKey);
    console.log('Cache deletado para produto de id ', userId);

    return 'produto deletado';
  }

  async findAll(userId: number) {
    const cacheKey = `user:${userId}:products`;

    try {
      const cacheProducts = await redis.get(cacheKey);
      if (cacheProducts) {
        console.log(`Cache encontrado para chave: ${cacheKey}`);
        return JSON.parse(cacheProducts);
      }

      const products = await Product.findAll({
        where: { userId: userId },
      });

      await redis.set(cacheKey, JSON.stringify(products), {
        EX: 300,
      });
      console.log(`Cache criado para chave: ${cacheKey}`);

      return products;
    } catch (error) {
      throw new InternalError('Falha ao listar produtos: ' + error);
    }
  }
}
