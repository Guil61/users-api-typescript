import { Router } from "express";
import { UserController } from "../controller/user-controller";
import { authenticateToken } from "../middleware/authMiddleWare";

const usersRouter = Router();

const userController = new UserController();

usersRouter.get("/", authenticateToken, userController.findAll.bind(userController));
usersRouter.get("/:id", authenticateToken, userController.findById.bind(userController));
usersRouter.delete("/:id", authenticateToken, userController.delete.bind(userController));


export default usersRouter