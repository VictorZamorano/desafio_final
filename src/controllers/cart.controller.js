
import { cartHandleErrors } from "../helpers/cart.errors.js";
import { cartModel } from "../models/cart.model.js";

const getCart = async (req, res) => {
	const tokenId = req.id
	try {
		const getCart = await cartModel.getCart(tokenId);
		res.status(200).json( getCart );
	} catch (error) {
		console.log(error.message);
		const { status, message } = cartHandleErrors(error.code);
		return res.status(status).json({ result: message });
	}
};

const addProductToCart = async (req, res) => {
	const {product} = req.body
	const tokenId = req.id
	try {
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
