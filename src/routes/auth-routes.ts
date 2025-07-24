import { Router } from "express";
import { AuthController } from "../controller/auth-controller";
import { authenticateToken } from "../middleware/authMiddleWare";

const authController = new AuthController();
const authRouter = Router();

authRouter.post("/login", authController.login.bind(authController));
authRouter.post("/register", authController.register.bind(authController));
authRouter.patch("/refresh", authController.refresh.bind(authController));
authRouter.post("/password-recovery", authController.recoverPassword.bind(authController));
authRouter.patch("/change-password", authenticateToken, authController.changePassword.bind(authController));

export default authRouter;
