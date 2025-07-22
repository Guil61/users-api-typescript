export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export interface UserLoginRequestDto {
  email: string;
  password: string;
}

export interface UserLoginResponseDto {
  email: string;
  token: string;
}

export interface UserReponseDto {
  id?: number;
  name: string;
  email: string;
}

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
}