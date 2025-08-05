import app from './app';
import { connectRedis } from './database/config/redis';

const port = process.env.PORT;

const main = async () => {
  await connectRedis();

  app.listen(port, () => {
    console.log('Server running, port:' + port);
  });
};

main();
