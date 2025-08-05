import { NotFoundError, UserNotOwnerError } from '../handler/apiErrors';
import { ProductService } from '../service/product-service';
import { Request, Response } from 'express';

export class ProductController {
  private productService: ProductService = new ProductService();

  async create(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(403).json({ msg: 'Usuário não autenticado' });
      }

      const data = {
        ...req.body,
        userId,
      };

      const result = await this.productService.create(data);
      return res.status(201).json({ msg: 'Produto criado!', result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'erro interno' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.userId;

      if (!userId) {
        return res.status(403).json({ msg: 'Usuário não autenticado' });
      }

      const data = {
        ...req.body,
        userId,
      };

      const result = await this.productService.update(id, data);
      return res.status(200).json({ msg: 'Produto atualizado!', result });
    } catch (error) {
      console.error(error);

      if (error instanceof UserNotOwnerError) {
        return res.status(403).json({ error: error.message });
      }
    }
    return res.status(500).json({ msg: 'erro interno' });
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.userId;

      if (!userId) {
        return res.status(403).json({ msg: 'Usuário não autenticado' });
      }

      const result = await this.productService.delete(id, userId);
      return res.status(200).json({ msg: 'Produto deletado!', result });
    } catch (error) {
      console.error(error);

      if (error instanceof UserNotOwnerError) {
        return res.status(403).json({ error: error.message });
      }
    }
    return res.status(500).json({ msg: 'erro interno' });
  }

  async findById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.userId;

      if (!userId) {
        return res.status(403).json({ msg: 'Usuário não autenticado' });
      }

      const result = await this.productService.findById(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
    }
    return res.status(500).json({ msg: 'Erro interno' });
  }

  async findAll(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(403).json({ msg: 'Usuário não autenticado' });
      }
      const result = await this.productService.findAll(userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error)
      return res.status(500).json({ msg: 'Erro interno' });
    }
  }
}
