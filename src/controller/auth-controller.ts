import e, { Request, Response } from "express";
import { AuthService } from "../service/auth-service";
import { BadRequestError } from "../handler/apiErrors";

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response) {
    try {
      const login = await this.authService.login(req.body);
      return res.status(201).json(login);
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestError) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(500).json({ error: "Erro interno do servidor." });
  }

  async register (req: Request, res: Response) {
    try{
      const register = await this.authService.register(req.body);
      return res.status(201).json({msg: "Usuário criado!", register});
    }catch(error){
        console.error(error);
        if (error instanceof BadRequestError) {
        return res.status(400).json({ error: error.message });
    }
  }
      return res.status(500).json({ error: "Erro interno do servidor." });
  }
}
