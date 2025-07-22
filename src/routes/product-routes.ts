import { Router } from "express";
import { ProductController } from "../controller/product-controller";
import { authenticateToken } from "../middleware/authMiddleWare";

const productRoutes = Router();

const productController = new ProductController();

productRoutes.post("/new", authenticateToken, productController.create.bind(productController));

export default productRoutes;