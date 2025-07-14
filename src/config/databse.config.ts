import { Sequelize } from "sequelize";

const db = new Sequelize("usuarios", "postgres", "postgres", {
  dialect: "postgres",
  host: "localhost",
  logging: false,
});

export default db;
