import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../handler/apiErrors";
import { emailIsValid, passwordIsValid } from "../utils/validators";
import {
  CreateUserDto,
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserReponseDto,
} from "../database/dtos/UserDtos";
import User from "../database/models/User";
import RefreshToken from "../database/models/RefreshToken";
import { MailService } from "./mail-service";
import {
  NewPasswordRequestDto,
  RecoverPasswordRequestDto,
} from "../database/dtos/AuthDtos";

export class AuthService {
  private mailService: MailService;

  constructor() {
    this.mailService = new MailService();
  }

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

    const refreshToken = jwt.sign(
      { id: userData.id },
      process.env.JWT_PASS ?? "",
      {
        expiresIn: "7d",
      }
    );

    return {
      email: userData.email,
      token,
      refreshToken,
    };
  }

  async register(data: CreateUserDto): Promise<UserReponseDto> {
    const userExists = await User.findOne({
      where: { email: data.email },
    });

    if (userExists) {
      throw new BadRequestError("Email já existe");
    }

    console.log("Email: ", data.email);
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

  async refresh(token: string) {
    try {
      const refreshToken = token.split(" ")[1];

      const decoded = jwt.verify(refreshToken, process.env.JWT_PASS!) as {
        id: number;
      };

      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_PASS!,
        { expiresIn: "1h" }
      );

      const newRefreshToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_PASS!,
        { expiresIn: "7d" }
      );

      return {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError("Refresh token inválido ou expirado");
    }
  }

  async recoverPassword(data: RecoverPasswordRequestDto): Promise<string> {
    const user = await User.findOne({
      where: { email: data.userMail },
    });

    if (!user) {
      throw new NotFoundError("Email de usuário não encontrado!");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "24h",
    });

    try {
      const subject = "Alteração de senha";
      await this.mailService.sendMail(data.userMail, subject, token);
    } catch (error) {
      return String(error);
    }

    return (
      "Um email com o token para recuperação foi enviado para o email" +
      data.userMail
    );
  }

  async changePassword( data: NewPasswordRequestDto,userId: number): Promise<string> {

    console.log('Data recebida:', data); 
    console.log('Email:', data.email); 
    const user = await User.findByPk(userId);

    if (!user) {
      throw new UnauthorizedError("Usuário não autenticado");
    }

    if (!data.email || !data.newPassword) {
      throw new BadRequestError("Preencha os campos nova senha e email.");
    }

    if (data.email !== user.email) {
      throw new UnauthorizedError("Email não pertence ao usuário autenticado.");
    }

    if (!emailIsValid(data.email)) {
      throw new BadRequestError("Formato de email inválido!");
    }

    if (!passwordIsValid(data.newPassword)) {
      throw new BadRequestError("Senha não atende aos requisitos!");
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

    user.password = newPasswordHash;

    await user.save();

    return "Senha atualizada!";
  }
}
