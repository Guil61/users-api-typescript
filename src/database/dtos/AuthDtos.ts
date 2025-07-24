export interface RecoverPasswordRequestDto {
    userMail: string;
}

export interface NewPasswordRequestDto {
    email: string;
    newPassword: string;
}