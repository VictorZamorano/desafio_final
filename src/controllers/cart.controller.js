
import { cartHandleErrors } from "../helpers/cart.errors.js";
import { cartModel } from "../models/cart.model.js";

const getCart = async (req, res) => {
	try {
		const tokenId = req.id

		if(!tokenId){
			throw {code: "404.2"}
		}
		const getCart = await cartModel.getCart(tokenId);

		console.log("Pase por getCart: ", getCart);

		if(!getCart){
			throw {code: "404"}
		}

		res.status(200).json( getCart );
	} catch (error) {
		console.log(error.message);
		const { status, message } = cartHandleErrors(error.code);
		return res.status(status).json({ result: message });
	}
};

const addProductToCart = async (req, res) => {
	try {
		const {product} = req.body
		const tokenId = req.id
		if(!tokenId){
			throw {code: "404.2"}
		}
		if(!product[0].product_id){
			throw {code: "404.5"}
		}
		if(product[0].quantity === 0){
			throw {code: "404.3"}
		}
		
		const addProduct = await cartModel.addProductToCart(tokenId, product);
		res.status(200).json( addProduct );
	} catch (error) {
		console.log(error.message);
		const { status, message } = cartHandleErrors(error.code);
		return res.status(status).json({ result: message });
	}
};

const deleteProductFromCart = async (req, res) => {
	const {product} = req.body
	const tokenId = req.id
	try {
		if(!tokenId){
			throw {code: "404.2"}
		}
		if(!product[0].product_id){
			throw {code: "404.3"}
		}
		const deleteProduct = await cartModel.deleteProductFromCart(tokenId, product);
		res.status(200).json( deleteProduct );
	} catch (error) {
		console.log(error.message);
		const { status, message } = cartHandleErrors(error.code);
		return res.status(status).json({ result: message });
	}
}


export const cartController = {
	getCart,
	addProductToCart,
	deleteProductFromCart
};
