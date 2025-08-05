import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import usersRouter from './routes/user-routes';
import authRouter from './routes/auth-routes';
import productRoutes from './routes/product-routes';
import { errorMiddleware } from './middleware/error';

const app = express();

app.use(express.json());
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/products', productRoutes);
app.use(errorMiddleware);

export default app;
