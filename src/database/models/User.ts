import { Model, DataTypes } from "sequelize";
import Product from "./Product";
import { db } from "..";
import { CreateUserDto, UserAttributes } from "../dtos/UserDtos";
import RefreshToken from "./RefreshToken";

class User extends Model<UserAttributes, CreateUserDto> {
  static associate() {
    User.hasMany(Product, {
      foreignKey: "userId",
    });
    User.hasMany(RefreshToken, {
      foreignKey: "userId",
    })
  }
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "user",
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

// User.hasMany(Product, {
//   foreignKey: "userId",
//   as: "products",
// });

export default User;
