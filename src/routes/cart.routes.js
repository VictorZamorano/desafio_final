import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/users.middlewares.js";
import { verifyCartRequest } from "../middlewares/cartMiddleWare.js";

const cartRoutes = Router();

cartRoutes.get("/",  verifyToken, cartController.getCart);
cartRoutes.put("/", verifyToken, verifyCartRequest, cartController.addProductToCart);
cartRoutes.delete("/", verifyToken, verifyCartRequest, cartController.deleteProductFromCart);


export default cartRoutes;