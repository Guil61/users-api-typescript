import {
  BadRequestError,
  InternalError,
  NotFoundError,
} from "../handler/apiErrors";
import UserInstance, {
  UpdateUserDto,
  UserReponseDto,
} from "../model/userModel";
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

async update(req: UpdateUserDto): Promise<UserReponseDto> {
  const user = await UserInstance.findOne({
    where: { email: req.email },
  });

  user?.get();

  if (!user) {
    throw new NotFoundError("Usuário não encontrado.");
  }

  if (req.nome) {
    user.nome = req.nome;
  }

  if (req.senha) {
    const hashPassword = await bcrypt.hash(req.senha, 10);
    user.senha = hashPassword
  }

  await user.update({
    nome: user.nome,
    senha: user.senha
  });

  // await user.save();

  const userData = user.get()

  return {
    id: userData.id!,
    nome: userData.nome,
    email: userData.email,
  };
}


  async findAll() {
    try {
      return await UserInstance.findAll();
    } catch (error) {
      throw new InternalError("Falha ao listar usuário: " + error);
    }
  }
}
