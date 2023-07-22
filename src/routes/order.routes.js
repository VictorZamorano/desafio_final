import { Router } from "express";
import { verifyToken } from "../middlewares/users.middlewares.js";
import { orderController } from "../controllers/order.controller.js";

const orderRoutes = Router();

orderRoutes.post("/", verifyToken, orderController.getOrder);




export default orderRoutes;