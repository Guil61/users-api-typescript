import { Model, DataTypes } from "sequelize";
import User from "./User";
import { db } from "..";
import { CreateProductDto, ProductAttributes } from "../dtos/ProductDtos";

class Product extends Model <ProductAttributes, CreateProductDto>{
  static associate() {
    Product.belongsTo(User, {
      foreignKey: "userId",
    });
  }
  declare id: number;
  declare name: string;
  declare code: string;
  declare description: string;
  declare userId: number;
}

Product.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "user",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize: db,
    tableName: "product",
    underscored: true,
    timestamps: false,
  }
);

// Product.belongsTo(User, {
//   foreignKey: "userId",
//   as: "user",
// });

export default Product;
