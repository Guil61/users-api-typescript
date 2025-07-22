import { CreateUserDto, UserAttributes, UserReponseDto } from "../database/dtos/UserDtos";
import User from "../database/models/User";


export function dtoToUserEntity(dto: CreateUserDto): Omit<UserAttributes, 'id'> {
  return {
    name: dto.name,
    email: dto.email,
    password: dto.password,
  };
}

export function userEntityToResponseDto(user: User): UserReponseDto {
  const userData = user.get();
  
  if (!userData.id) {
    throw new Error("ID do usuário não encontrado");
  }
  
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
  };
}


