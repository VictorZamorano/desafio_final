import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/users.middlewares.js";

const usersRouter = Router();

usersRouter.post("/login", usersController.tokenGen);
usersRouter.post("/register", usersController.generateUser);
usersRouter.get("/user", verifyToken, usersController.getUser);
usersRouter.put("/user", verifyToken, usersController.editUser);

export default usersRouter;
