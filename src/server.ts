import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import usersRouter from './routes/user-routes';
import { errorMiddleware } from './middleware/error';
import authRouter from './routes/auth-routes';
import { db } from './database';
import productRoutes from './routes/product-routes';
import { connectRedis } from './database/config/redis';

const main = async () => {
  const app = express();
  const port = process.env.PORT;

  app.use(express.json());
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/products', productRoutes);

  app.use(errorMiddleware);

  app.listen(port, () => {
    console.log('Server running, port:' + port);
  });

  await connectRedis();
};

main();
