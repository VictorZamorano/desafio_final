import { cartHandleErrors } from "../helpers/cart.errors.js";
import { cartModel } from "../models/cart.model.js";
import { orderModel } from "../models/order.model.js";


const getOrder= async (req, res) => {
    const {id} = req.params
	try {
		const getOrder = await orderModel.genOrder(id);
		// console.log(getCart);
		res.status(200).json( getOrder );
	} catch (error) {
		console.log(error.message);
		const { status, message } = cartHandleErrors(error.code);
		return res.status(status).json({ result: message });
	}
};


export const orderController = {
	getOrder
};