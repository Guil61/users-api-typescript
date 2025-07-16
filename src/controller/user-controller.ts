import { Request, Response } from "express";
import { UserService } from "../service/user-service";
import { BadRequestError } from "../handler/apiErrors";

export class UserController {
  private userService = new UserService();

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

  async update(req: Request, res: Response) {
    try {
      const result = await this.userService.update(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
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
