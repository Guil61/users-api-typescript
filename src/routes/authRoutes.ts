import { Router } from "express";
import { AuthController } from "../controller/auth-controller";

const authController = new AuthController();
const authRouter = Router();

authRouter.post("/login", authController.login.bind(authController));
authRouter.post("/register", authController.register.bind(authController));


export default authRouter;
