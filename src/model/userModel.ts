import { DataTypes, Model } from "sequelize";
import db from "../config/databse.config";

export interface CreateUserDto {
  nome: string;
  email: string;
  senha: string;
}

export interface UpdateUserDto {
  id?: number;
  nome: string;
  email: string;
  senha: string;
}

export interface UserLoginRequestDto {
  email: string;
  senha: string;
}

export interface UserLoginResponseDto {
  email: string;
  token: string;
}

export interface UserReponseDto {
  id?: number;
  nome: string;
  email: string;
}

export interface UserAttributes {
  id?: number;
  nome: string;
  email: string;
  senha: string;
}

export class UserInstance
  extends Model<UserAttributes>
  implements UserAttributes
{
  id?: number;
  nome!: string;
  email!: string;
  senha!: string;
}

UserInstance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
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
