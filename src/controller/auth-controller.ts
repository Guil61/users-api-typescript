import { Request, Response } from "express";
import { AuthService } from "../service/auth-service";
import { BadRequestError, UnauthorizedError } from "../handler/apiErrors";

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response) {
    try {
      const login = await this.authService.login(req.body);
      return res.status(200).json(login);
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestError) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(500).json({ error: "Erro interno do servidor." });
  }

  async register(req: Request, res: Response) {
    try {
      const register = await this.authService.register(req.body);
      return res.status(201).json({ msg: "Usuário criado!", register });
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestError) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(500).json({ error: "Erro interno do servidor." });
  }

  async refresh(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res
          .status(400)
          .json({ error: "Token não fornecido ou inválido" });
      }

      const result = await this.authService.refresh(token);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: error });
    }
  }

  async recoverPassword(req: Request, res: Response) {
    try {
      const email = req.body;

      const result = await this.authService.recoverPassword(email);
      return res.status(200).json({ msg: result });
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword(req: Request, res: Response) {
    
    try {
      const userId = Number(req.userId);
      const data = req.body;

      if (!userId) {
        return res.status(403).json({ msg: "Usuário não autenticado" });
      }

      const result = await this.authService.changePassword(data, userId);
      return res.status(200).json({ msg: result });
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        return res.status(400).json({ msg: error.message });
      }
      if (error instanceof UnauthorizedError) {
        return res.status(403).json({ msg: error.message });
      }
    }
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}
