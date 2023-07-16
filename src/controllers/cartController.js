
import { handleErrors } from "../helpers/users.errors.js";
import { cartModel } from "../models/cartModel.js";

const getCart = async (req, res) => {
    const {id} = req.params
	try {
		const getCart = await cartModel.getCart(id);
		// console.log(getCart);
		res.status(200).json( getCart );
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ result: message });
	}
};

const addProductToCart = async (req, res) => {
	const {user_account_id, product} = req.body
	try {
		const addProduct = await cartModel.addProductToCart(user_account_id, product);
		res.status(200).json( addProduct );
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ result: message });
	}
};

const deleteProductFromCart = async (req, res) => {
	const {user_account_id, product} = req.body
	try {
		const deleteProduct = await cartModel.deleteProductFromCart(user_account_id, product);
		res.status(200).json( deleteProduct );
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ result: message });
	}
}


export const cartController = {
	getCart,
	addProductToCart,
	deleteProductFromCart
};
