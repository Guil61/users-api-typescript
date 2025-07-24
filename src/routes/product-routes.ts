import { Router } from "express";
import { ProductController } from "../controller/product-controller";
import { authenticateToken } from "../middleware/authMiddleWare";

const productRoutes = Router();

const productController = new ProductController();

productRoutes.post("/new", authenticateToken, productController.create.bind(productController));
productRoutes.put("/:id", authenticateToken, productController.update.bind(productController));
productRoutes.delete("/:id", authenticateToken, productController.delete.bind(productController));
productRoutes.get("/:id", authenticateToken, productController.findById.bind(productController));
productRoutes.get("/", authenticateToken, productController.findAll.bind(productController));

export default productRoutes;