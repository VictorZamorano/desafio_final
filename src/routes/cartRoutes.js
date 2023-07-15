import { Router } from "express";
import { cartController } from "../controllers/cartController.js";

const cartRoutes = Router();

cartRoutes.get("/cart/:id", cartController.getCart);
cartRoutes.put("/cart/", cartController.addProductToCart);
cartRoutes.delete("/cart/", cartController.deleteProductFromCart);



export default cartRoutes;