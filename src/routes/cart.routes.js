import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/users.middlewares.js";
import { verifyCartRequest } from "../middlewares/cartMiddleWare.js";

const cartRoutes = Router();

// Obtiene el cart
cartRoutes.get("/",  verifyToken, cartController.getCart);
// Añade un objeto al cart o aumenta su cantidad
cartRoutes.put("/", verifyToken, verifyCartRequest, cartController.addProductToCart);
// Elimina un producto o reduce la cantidad
cartRoutes.delete("/", verifyToken, verifyCartRequest, cartController.deleteProductFromCart);


export default cartRoutes;