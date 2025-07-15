import UserInstance, {
  CreateUserDto,
  UserAttributes,
  UserReponseDto,
} from "../model/userModel";

export function dtoToUserEntity(dto: CreateUserDto): Omit<UserAttributes, 'id'> {
  return {
    nome: dto.nome,
    email: dto.email,
    senha: dto.senha,
  };
}

export function userEntityToResponseDto(user: UserInstance): UserReponseDto {
  const userData = user.get();
  
  if (!userData.id) {
    throw new Error("ID do usuário não encontrado");
  }
  
  return {
    id: userData.id,
    nome: userData.nome,
    email: userData.email,
  };
}


