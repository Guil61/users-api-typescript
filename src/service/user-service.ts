import {
  BadRequestError,
  InternalError,
  NotFoundError,
} from "../handler/apiErrors";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../database/models/User";
import { UpdateUserDto, UserReponseDto } from "../database/dtos/UserDtos";


export class UserService {
  async findById(id: number): Promise<User | null> {
    const userExists = await User.findByPk(id);

    if (!userExists) {
      throw new NotFoundError("Usuário com id " + id + "não existe.");
    }

    return await User.findByPk(id);
  }

  async delete(id: number): Promise<number> {
    const userExists = await User.findByPk(id);

    if (!userExists) {
      throw new NotFoundError("Usuário com id " + id + " não existe.");
    }

    return await User.destroy({
      where: { id },
    });
  }

async update(req: UpdateUserDto): Promise<UserReponseDto> {
  const user = await User.findOne({
    where: { email: req.email },
  });

  user?.get();

  if (!user) {
    throw new NotFoundError("Usuário não encontrado.");
  }

  if (req.name) {
    user.name = req.name;
  }

  if (req.password) {
    const hashPassword = await bcrypt.hash(req.password, 10);
    user.password = hashPassword
  }

  await user.update({
    name: user.name,
    password: user.password
  });


  const userData = user.get()

  return {
    id: userData.id!,
    name: userData.name,
    email: userData.email,
  };
}


  async findAll() {
    try {
      return await User.findAll();
    } catch (error) {
      throw new InternalError("Falha ao listar usuários: " + error);
    }
  }
}
