import * as dotenv from "dotenv";
dotenv.config();

import { cartHandleErrors } from "../helpers/cart.errors.js";

 export const verifyCartRequest = (req, res, next) => {
    try {
      const {product} = req.body;
      if(!product){
        throw {code: "400"}
      } else {
        if(product.length === 0){
            throw {code: "400"}
        } else {
            product.forEach((p) => {
                if(!p.product_id){
                    throw {code: "400"}
                } else {
                    if(p.product_id <= 0){
                        throw {code: "400"}
                    }
                }

                if(!p.quantity){
                    throw {code: "400"}
                } else{
                    if(p.quantity <= 0){
                        throw {code: "400"}  
                    }
                }
            })
        }
      }
      next();
    } catch (error) {
      const { status, message } = cartHandleErrors(error.code, error.message);
      res.status(status).json({ status, message });
    }
  };