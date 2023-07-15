import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";
import { verifyToken } from "../middlewares/users.middlewares.js";

const productsRouter = Router();

// devuelve 20 productos // 
productsRouter.get("/", productsController.getAllProducts);

//devuelve un producto por id.
productsRouter.get("/:id", productsController.getProduct);

// devuelve 5 productos por categoria escogida
productsRouter.get("/category/:category", productsController.getCategory); 

// modificar y soft delete soft delete de producto por id
productsRouter.put("/:id", verifyToken, productsController.editProduct);

// crea nuevo producto previa autorizacion
productsRouter.post("/", verifyToken, productsController.generateProduct);

export default productsRouter;
