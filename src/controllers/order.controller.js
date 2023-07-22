import { cartHandleErrors } from "../helpers/cart.errors.js";
import { orderModel } from "../models/order.model.js";


const getOrder= async (req, res) => {
    const tokenId = req.id
	try {
		const getOrder = await orderModel.genOrder(tokenId);
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