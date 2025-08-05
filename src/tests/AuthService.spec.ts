import { AuthService } from "../../src/service/auth-service";
import User from "../../src/database/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MailService } from "../../src/service/mail-service";
// Mocks
jest.mock("../../src/database/models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../src/service/mail-service");

describe("AuthService - Sucesso", () => {
  const authService = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully register a new user", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
    (User.create as jest.Mock).mockResolvedValue({});

    const result = await authService.register({
      name: "Andre",
      email: "andre@email.com",
      password: "Senha@123",
    });

    expect(result).toEqual({
      name: "Andre",
      email: "andre@email.com",
    });
    expect(User.create).toHaveBeenCalled();
  });

  it("should successfully login", async () => {
    const userMock = {
      get: () => ({
        id: 1,
        email: "andre@email.com",
        password: "senha_hash",
      }),
    };

    (User.findOne as jest.Mock).mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValueOnce("token").mockReturnValueOnce("refreshToken");

    const result = await authService.login({
      email: "andre@email.com",
      password: "Senha@123",
    });

    expect(result).toEqual({
      email: "andre@email.com",
      token: "token",
      refreshToken: "refreshToken",
    });
  });

  it("should successfully login", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
    (jwt.sign as jest.Mock).mockReturnValueOnce("new_token").mockReturnValueOnce("new_refresh");

    const result = await authService.refresh("Bearer old_refresh_token");

    expect(result).toEqual({
      token: "new_token",
      refreshToken: "new_refresh",
    });
  });

  it("should successfully update users's password", async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    const userMock = {
      email: "andre@email.com",
      password: "old_hash",
      save: saveMock,
    };

    (User.findByPk as jest.Mock).mockResolvedValue(userMock);
    (bcrypt.hash as jest.Mock).mockResolvedValue("new_hash");

    const result = await authService.changePassword(
      {
        email: "andre@email.com",
        newPassword: "NovaSenha@123",
      },
      1
    );

    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe("Senha atualizada!");
  });
});
