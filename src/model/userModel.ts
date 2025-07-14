import { DataTypes, Model } from "sequelize";
import db from "../config/databse.config";

interface UserAttributes {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

class UserInstance extends Model<UserAttributes> {}

UserInstance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    sequelize: db,
    tableName: "usuarios",
  }
);

export default UserInstance;
