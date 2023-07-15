import { Router } from "express";
import { cartController } from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/users.middlewares.js";

const cartRoutes = Router();

cartRoutes.get("/cart/:id", verifyToken, cartController.getCart);
cartRoutes.put("/cart/", verifyToken, cartController.addProductToCart);
cartRoutes.delete("/cart/", verifyToken, cartController.deleteProductFromCart);



export default cartRoutes;