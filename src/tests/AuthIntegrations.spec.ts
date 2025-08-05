import request from 'supertest';
import app from '../app';
import { db } from '../database';
import User from '../database/models/User';
import bcrypt from 'bcrypt';

jest.mock('../service/mail-service', () => ({
  MailService: jest.fn().mockImplementation(() => ({
    sendMail: jest.fn().mockResolvedValue(true),
  })),
}));

describe('Auth integration tests', () => {
  let userId: number;
  let userToken: string;

  beforeAll(async () => {
    await db.sync({ force: true });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await db.close();
  });

  it('should register a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123@',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe('Usuário criado!');
    expect(response.body.register.name).toBe('Test User');
    expect(response.body.register.email).toBe('test@example.com');

    const userInDb = await User.findOne({ where: { email: 'test@example.com' } });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.name).toBe('Test User');
  });

  it('should login successfully with valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('Password123@', 10);
    const user = await User.create({
      name: 'Login Test User',
      email: 'login@example.com',
      password: hashedPassword,
    });

    const loginData = {
      email: 'login@example.com',
      password: 'Password123@',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('login@example.com');
    expect(response.body.token).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  it('should refresh tokens successfully', async () => {
    const hashedPassword = await bcrypt.hash('Password123@', 10);
    await User.create({
      name: 'Refresh Test User',
      email: 'refresh@example.com',
      password: hashedPassword,
    });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'refresh@example.com',
        password: 'Password123@',
      });

    const refreshToken = loginResponse.body.refreshToken;

    const response = await request(app)
      .patch('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  it('should send recovery email successfully', async () => {
    const hashedPassword = await bcrypt.hash('Password123@', 10);
    await User.create({
      name: 'Recovery Test User',
      email: 'recovery@example.com',
      password: hashedPassword,
    });

    const response = await request(app)
      .post('/auth/password-recovery')
      .send({
        userMail: 'recovery@example.com',
      });

    expect(response.status).toBe(200);
    expect(response.body.msg).toContain('Um email com o token para recuperação foi enviado');
  });

  it('should change password successfully', async () => {
    const hashedPassword = await bcrypt.hash('OldPassword123@', 10);
    const user = await User.create({
      name: 'Change Password User',
      email: 'change@example.com',
      password: hashedPassword,
    });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'change@example.com',
        password: 'OldPassword123@',
      });

    const token = loginResponse.body.token;

    const changePasswordData = {
      email: 'change@example.com',
      newPassword: 'NewPassword123@',
    };

    const response = await request(app)
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(changePasswordData);

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Senha atualizada!');

    const newLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'change@example.com',
        password: 'NewPassword123@',
      });

    expect(newLoginResponse.status).toBe(200);
  });
});