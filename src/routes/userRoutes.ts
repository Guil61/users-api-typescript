import { Router } from "express";
import { UserController } from "../controller/user-controller";

const usersRouter = Router();

const userController = new UserController();

usersRouter.post("/create-user", userController.createUser.bind(userController));
usersRouter.get("/list-all", userController.findAll.bind(userController));
usersRouter.get("/:id", userController.findById.bind(userController));
usersRouter.delete("/:id", userController.delete.bind(userController));


export default usersRouter