import dotenv from 'dotenv';
dotenv.config();

import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL
});

redis.on('error', (err) => console.error('Redis error', err));
redis.on('connect', () => console.log(' Redis conectado!'));

export const connectRedis = async () => {
  await redis.connect();
};
