import { ProductService } from "../service/product-service";
import { Request, Response } from "express";

export class ProductController {
  private productService: ProductService = new ProductService();

  async create(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(403).json({ msg: "Usuário não autenticado" });
      }

      const data = {
        ...req.body,
        userId,
      };

      const result = await this.productService.create(data);
      return res.status(201).json({ msg: "Produto criado!", result });
    } catch (erro) {
      return res.status(500).json({ msg: "erro interno" });
    }
  }
}
