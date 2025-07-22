import "dotenv/config";
import { Options } from "sequelize";

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

const dialect = "postgres";

const config: Options = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: dialect,
};

export = config;
