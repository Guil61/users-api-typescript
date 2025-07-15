require("dotenv").config();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserInstance, {
  CreateUserDto,
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserReponseDto,
} from "../model/userModel";
import { BadRequestError } from "../handler/apiErrors";
import { emailIsValid, passwordIsValid } from "../utils/validators";
import { userEntityToResponseDto } from "../mapper/userMapper";

export class AuthService {
  async login(data: UserLoginRequestDto): Promise<UserLoginResponseDto> {

    const user = await UserInstance.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestError("Email ou senha inválidos");
    }

    const userData = user.get();

    const verifyPass = await bcrypt.compare(data.senha, userData.senha);

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
        const userExists = await UserInstance.findOne({
          where: { email: data.email }
        });
    
        if (userExists) {
          throw new BadRequestError("Email já existe");
        }
    
        if (!passwordIsValid(data.senha)) {
          throw new BadRequestError("Senha não atende aos requisitos.");
        }
    
        if (!emailIsValid(data.email)) {
          throw new BadRequestError("Formato de email inválido.");
        }
    
        const hashPassword = await bcrypt.hash(data.senha, 10);
        data.senha = hashPassword;
    
        const user = await UserInstance.create(data);
    
        return userEntityToResponseDto(user);
  }
}
