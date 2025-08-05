import 'dotenv/config';
import { Options } from 'sequelize';

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, NODE_ENV } = process.env;

const dialect = 'postgres';

const config: Options = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: dialect,
};

const testConfig: Record<string, Options> = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: dialect,
  },
    test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME + "_test",
    host: DB_HOST,
    dialect: dialect,
  },
};

export = testConfig [NODE_ENV ?? "development"];
