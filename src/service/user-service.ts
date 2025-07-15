import {
  BadRequestError,
  InternalError,
  NotFoundError,
} from "../handler/apiErrors";
import UserInstance, { UserReponseDto } from "../model/userModel";
import { emailIsValid, passwordIsValid } from "../utils/validators";
import { CreateUserDto } from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userEntityToResponseDto } from "../mapper/userMapper";

export class UserService {

  async findById(id: number): Promise<UserInstance | null> {
    const userExists = await UserInstance.findByPk(id);

    if (!userExists) {
      throw new NotFoundError("Usuário com id " + id + "não existe.");
    }

    return await UserInstance.findByPk(id);
  }

  async delete(id: number): Promise<number> {
    const userExists = await UserInstance.findByPk(id);

    if (!userExists) {
      throw new NotFoundError("Usuário com id " + id + " não existe.");
    }

    return await UserInstance.destroy({
      where: { id },
    });
  }

  async findAll() {
    try {
      return await UserInstance.findAll();
    } catch (error) {
      throw new InternalError("Falha ao listar usuário: " + error);
    }
  }
}
