import request from 'supertest';
import app from '../app';
import { db } from '../database';
import User from '../database/models/User';
import Product from '../database/models/Product';
import bcrypt from 'bcrypt';
import { redis } from '../database/config/redis';

jest.mock('../service/product-service', () => {
  const originalModule = jest.requireActual('../service/product-service');
  
  return {
    ...originalModule,
    ProductService: class MockProductService {
      async create(data: any) {
        const product = await Product.create(data);
        return {
          id: product.id,
          name: product.name,
          code: product.code,
          description: product.description,
          userId: product.userId,
        };
      }

      async update(id: number, data: any) {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        
        if (data.newUserMail) {
          const User = require('../database/models/User').default;
          const newUser = await User.findOne({ where: { email: data.newUserMail } });
          if (newUser) data.userId = newUser.id;
        }

        await product.update(data);
        return {
          id: product.id,
          name: product.name,
          code: product.code,
          description: product.description,
          userId: product.userId,
        };
      }

      async delete(id: number, userId: number) {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        if (product.userId !== userId) throw new Error('User not owner');
        
        await product.destroy();
        return 'produto deletado';
      }

      async findById(id: number) {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        
        return {
          id: product.id,
          name: product.name,
          code: product.code,
          description: product.description,
          userId: product.userId,
        };
      }

      async findAll(userId: number) {
        const products = await Product.findAll({ where: { userId } });
        return products.map(product => ({
          id: product.id,
          name: product.name,
          code: product.code,
          description: product.description,
          userId: product.userId,
        }));
      }
    }
  };
});

describe('Product integration tests', () => {
  let token: string;
  let userId: number;
  let createdProductId: number;

  beforeAll(async () => {
    if (!process.env.JWT_PASS) {
      process.env.JWT_PASS = 'test-jwt-secret-key';
    }

    try {
      await db.authenticate();
      await db.sync({ force: true });
    } catch (error) {
      console.error('Database setup failed:', error);
    }

    const hashedPassword = await bcrypt.hash('Senha@123', 10);

    const user = await User.create({
      name: 'Controller test user',
      email: 'tester@test.com',
      password: hashedPassword,
    });
    userId = user.id;

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'tester@test.com',
        password: 'Senha@123',
      });

    if (loginResponse.status !== 200) {
      throw new Error(`Login failed: ${loginResponse.status} - ${JSON.stringify(loginResponse.body)}`);
    }

    token = loginResponse.body.token;
    
    if (!token) {
      throw new Error('Token not received from login');
    }
  });

  afterEach(async () => {
    try {
      await Product.destroy({ where: {}, truncate: true });
    } catch (error) {
      console.error('Product cleanup failed:', error);
    }
  });

  afterAll(async () => {
    try {
      await db.close();
      // await redis.flushAll();
    } catch (error) {
      console.error('Database close failed:', error);
    }
  });

  it('should create a new product', async () => {
    const productData = {
      name: 'Controller test product 1',
      code: 'P001',
      description: 'Test description',
    };

    const response = await request(app)
      .post('/products/new')
      .set('Authorization', `Bearer ${token}`)
      .send(productData);

    expect(response.status).toBe(201);
    expect(response.body.result.name).toBe('Controller test product 1');
    expect(response.body.msg).toBe('Produto criado!');

    const productInDb = await Product.findOne({ where: { code: 'P001' } });
    expect(productInDb).not.toBeNull();
    expect(productInDb?.name).toBe('Controller test product 1');
  });

  it('should update an existing product', async () => {
    const product = await Product.create({
      name: 'Original Product',
      code: 'ORIG001',
      description: 'Original description',
      userId: userId,
    });
    createdProductId = product.id;

    const updateData = {
      name: 'Updated Product Name',
      code: 'UPD001',
      description: 'Updated description',
    };

    const response = await request(app)
      .put(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Produto atualizado!');
    expect(response.body.result.name).toBe('Updated Product Name');

    const updatedProductInDb = await Product.findByPk(createdProductId);
    expect(updatedProductInDb?.name).toBe('Updated Product Name');
    expect(updatedProductInDb?.code).toBe('UPD001');
  });

  it('should delete a product', async () => {
    const product = await Product.create({
      name: 'Product to Delete',
      code: 'DEL001',
      description: 'To be deleted',
      userId: userId,
    });
    createdProductId = product.id;

    const response = await request(app)
      .delete(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Produto deletado!');

    const deletedProductInDb = await Product.findByPk(createdProductId);
    expect(deletedProductInDb).toBeNull();
  });

  it('should find a product by id', async () => {
    const product = await Product.create({
      name: 'Product to Find',
      code: 'FIND001',
      description: 'Find me',
      userId: userId,
    });
    createdProductId = product.id;

    const response = await request(app)
      .get(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Product to Find');
    expect(response.body.code).toBe('FIND001');
    expect(response.body.description).toBe('Find me');
  });

  it('should find all products for a user', async () => {
    await Product.create({
      name: 'Product 1',
      code: 'ALL001',
      description: 'First product',
      userId: userId,
    });

    await Product.create({
      name: 'Product 2',
      code: 'ALL002',
      description: 'Second product',
      userId: userId,
    });

    const response = await request(app)
      .get('/products/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    
    const productNames = response.body.map((p: any) => p.name);
    expect(productNames).toContain('Product 1');
    expect(productNames).toContain('Product 2');
  });
});