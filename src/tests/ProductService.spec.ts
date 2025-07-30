import { describe, it, expect } from '@jest/globals';
import { ProductService } from '../service/product-service';
import Product from '../database/models/Product';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../database/dtos/ProductDtos';
import User from '../database/models/User';
import { redis } from '../database/config/redis';

jest.mock('../database/models/User', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

jest.mock('../database/models/Product', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.mock('../database/config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

describe('ProductService Tests', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
    jest.clearAllMocks();
  });

  it('should create a product and return product response DTO', async () => {
    const inputData: CreateProductDto = {
      name: 'Produto Teste',
      code: 'TEST123',
      description: 'Descrição do produto',
      userId: 1,
    };

    const mockedProduct = {
      get: () => ({
        id: 1,
        name: inputData.name,
        code: inputData.code,
        description: inputData.description,
        userId: inputData.userId,
      }),
    };

    (Product.create as jest.Mock).mockResolvedValue(mockedProduct);

    const result = await productService.create(inputData);

    expect(Product.create).toHaveBeenCalledWith(inputData);
    expect(result).toEqual({
      id: 1,
      name: 'Produto Teste',
      code: 'TEST123',
      description: 'Descrição do produto',
      userId: 1,
    });
  });

  it('should update a product successfully', async () => {
    const productId = 1;
    const inputData: UpdateProductDto = {
      id: 1,
      name: 'Updated product name',
      code: 'UPD4T3D',
      newUserMail: 'newmail@mail.com',
      description: 'Updated description',
      userId: 1,
    };

    const mockExistingProduct = {
      id: 1,
      name: 'Old product name',
      code: 'OLD123',
      description: 'Old description',
      userId: 1,
      save: jest.fn().mockResolvedValue(undefined),
    };

    (Product.findByPk as jest.Mock).mockResolvedValue(mockExistingProduct);

    (User.findOne as jest.Mock).mockResolvedValue({ id: 2 });

    const result = await productService.update(productId, inputData);

    expect(Product.findByPk).toHaveBeenCalledWith(productId);
    expect(mockExistingProduct.save).toHaveBeenCalledTimes(1);
    expect(mockExistingProduct.name).toBe('Updated product name');
    expect(mockExistingProduct.code).toBe('UPD4T3D');
    expect(mockExistingProduct.description).toBe('Updated description');
    expect(mockExistingProduct.userId).toBe(2);

    expect(result).toEqual({
      id: 1,
      name: 'Updated product name',
      code: 'UPD4T3D',
      description: 'Updated description',
      userId: 2,
    });
  });

  it('should return product from cache if exists', async () => {
    const productId = 1;
    const cachedProduct = {
      id: 1,
      name: 'Cached Product',
      code: 'CACHED1',
      description: 'From cache',
      userId: 1,
    };

    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedProduct));

    const result = await productService.findById(productId);

    expect(redis.get).toHaveBeenCalledWith(`product:${productId}:product`);
    expect(result).toEqual(cachedProduct);
  });

  it('should return all products from cache', async () => {
    const userId = 1;
    const cachedProducts = [
      { id: 1, name: 'Cached P1', code: 'C1', description: '', userId: 1 },
      { id: 2, name: 'Cached P2', code: 'C2', description: '', userId: 1 },
    ];

    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedProducts));

    const result = await productService.findAll(userId);

    expect(redis.get).toHaveBeenCalledWith(`user:${userId}:products`);
    expect(result).toEqual(cachedProducts);
  });

  it('should fetch and cache products if not in cache', async () => {
    const userId = 1;
    const dbProducts = [
      { id: 1, name: 'P1', code: 'C1', description: '', userId: 1 },
    ];

    (redis.get as jest.Mock).mockResolvedValue(null);
    (Product.findAll as jest.Mock).mockResolvedValue(dbProducts);
    (redis.set as jest.Mock).mockResolvedValue(null);

    const result = await productService.findAll(userId);

    expect(Product.findAll).toHaveBeenCalledWith({ where: { userId } });
    expect(redis.set).toHaveBeenCalled();
    expect(result).toEqual(dbProducts);
  });

  it('should delete a product and its caches', async () => {
    const productId = 1;
    const userId = 1;

    const mockProduct = {
      id: 1,
      userId: 1,
      destroy: jest.fn().mockResolvedValue(undefined),
    };

    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(mockProduct));
    (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);
    (redis.del as jest.Mock).mockResolvedValue(undefined);

    const result = await productService.delete(productId, userId);

    expect(Product.findByPk).toHaveBeenCalledWith(productId);
    expect(mockProduct.destroy).toHaveBeenCalled();
    expect(redis.del).toHaveBeenCalledWith(`product:${productId}:product`);
    expect(redis.del).toHaveBeenCalledWith(`user:${userId}:products`);
    expect(result).toBe('produto deletado');
  });
});
