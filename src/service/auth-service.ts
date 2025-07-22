import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BadRequestError } from "../handler/apiErrors";
import { emailIsValid, passwordIsValid } from "../utils/validators";
import { CreateUserDto, UserLoginRequestDto, UserLoginResponseDto, UserReponseDto } from "../database/dtos/UserDtos";
import User from "../database/models/User";


export class AuthService {
  async login(data: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    const user = await User.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestError("Email ou senha inválidos");
    }

    const userData = user.get();

    const verifyPass = await bcrypt.compare(data.password, userData.password);

    if (!verifyPass) {
      throw new BadRequestError("Email ou senha inválidos");
    }

    const token = jwt.sign({ id: userData.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "24h",
    });

    return {
      email: userData.email,
      token,
    };
  }

  async register(data: CreateUserDto): Promise<UserReponseDto> {
    const userExists = await User.findOne({
      where: { email: data.email },
    });

    if (userExists) {
      throw new BadRequestError("Email já existe");
    }

    console.log("Email: ", data.email)
    console.log("Nome: ", data.name);
    console.log("Senha:", data.password);

    if (!passwordIsValid(data.password)) {
      throw new BadRequestError("Senha não atende aos requisitos.");
    }

    if (!emailIsValid(data.email)) {
      throw new BadRequestError("Formato de email inválido.");
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    data.password = hashPassword;

    await User.create(data);

    return {
      name: data.name,
      email: data.email,
    };
  }
}
