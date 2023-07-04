import { Router } from "express";
import { myControllers } from "../controllers/controller.js";
import { myMdleWare } from "../middlewares/middleware.js";

const router = Router();

router.get("/users", myControllers.getUsers);

router.post("/register", myControllers.postRegister);
router.post("/login", myControllers.postLogin);

router.delete("/product/:id", myControllers.deleteProduct);

router.get("*", myControllers.thisRouteNoExist);

export default router;
