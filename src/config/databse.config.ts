require("dotenv").config();


import { Sequelize } from "sequelize";


if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_PORT)  {
  throw new Error("variaveis nao configuradas");
}

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  port: parseInt(process.env.DB_PORT),
  dialect: "postgres",
  host: "localhost",
  logging: false,
});

export default db;