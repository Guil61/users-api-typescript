import { Request, Response } from "express";
import { UserService } from "../service/user-service";
import { BadRequestError } from "../handler/apiErrors";

export class UserController {
  private userService = new UserService();

  // async createUser(req: Request, res: Response) {
  //   try {
  //     const userDto = await this.userService.create(req.body);
  //     return res.status(201).json(userDto);
  //   } catch (error) {
  //     console.error(error)
  //     if (error instanceof BadRequestError) {
  //       return res.status(400).json({ error: error.message });
  //     }
  //     return res.status(500).json({ error: "Erro interno do servidor." });
  //   }
  // }

  async findById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await this.userService.findById(id);
    return res.json(result);
  }

  async delete(req: Request, res: Response) {
    const id: number = Number(req.params.id);
    const result = await this.userService.delete(id);
    return res.json({ msg: "Objeto deletado", result });
  }

  async findAll(req: Request, res: Response) {
    try {
      const result = await this.userService.findAll();
      return res.json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "erro interno" });
    }
  }
}
