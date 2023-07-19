import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/users.middlewares.js";

const cartRoutes = Router();

cartRoutes.get("/",  verifyToken, cartController.getCart);
cartRoutes.put("/", verifyToken, cartController.addProductToCart);
cartRoutes.delete("/", verifyToken, cartController.deleteProductFromCart);



export default cartRoutes;