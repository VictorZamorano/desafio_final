import { Router } from "express";
import { verifyToken } from "../middlewares/users.middlewares.js";
import { orderController } from "../controllers/order.controller.js";

const orderRoutes = Router();

orderRoutes.get("/order/:id", /* verifyToken, */ orderController.getOrder);
// orderRoutes.put("/cart/", /* verifyToken, */ cartController.addProductToCart);
// orderRoutes.delete("/cart/", /* verifyToken, */ cartController.deleteProductFromCart);



export default orderRoutes;