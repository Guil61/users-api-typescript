import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}


interface JwtPayload {
  id: number;
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const secret = process.env.JWT_PASS;
  if (!secret) {
    return res.status(500).json({ error: "Chave JWT não configurada" });
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.userId = payload.id;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
}
