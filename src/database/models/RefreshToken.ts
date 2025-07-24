import { DataTypes, Model } from "sequelize";
import User from "./User";
import { CreateRefreshTokenDto, RefreshTokenAttributes } from "../dtos/RefreshTokenDtos";
import { db } from "..";
import { AllowNull } from "sequelize-typescript";

class RefreshToken extends Model <RefreshTokenAttributes, CreateRefreshTokenDto>{
  static associate() {
    RefreshToken.belongsTo(User, {
      foreignKey: "userId",
    });
  }
  declare id: number;
  declare refreshToken: string;
  declare userId: number;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "refresh_token",
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
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },

  },
  {
    sequelize: db,
    tableName: "refresh_token",
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

export default RefreshToken;