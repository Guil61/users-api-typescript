require("dotenv").config();

import express, { Request, Response } from "express";
import db from "./config/databse.config";
import UserInstance from "./model/userModel";
import usersRouter from "./routes/userRoutes";
import { errorMiddleware } from "./middleware/error";
import authRouter from "./routes/authRoutes";

db.authenticate()
  .then(async () => {
    console.log("Conexão estabelecida com o banco.");

    await UserInstance.sync();
    console.log("Tabela de usuários sincronizada com o banco");
  })
  .catch((error) => {
    console.error("Erro ao conectar no banco:", error);
  });

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log("Server running, port:" + port);
});
