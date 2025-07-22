import { Sequelize } from "sequelize";
// import config from "./config/database"
import * as config from './config/database'

export const db = new Sequelize(config);
