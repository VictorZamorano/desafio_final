import { pool } from "../db/connection.js";

// ONLY FOR TESTING
const allUsers = async () => {
	const queryUser = "SELECT * FROM user_account";

	try {
		const { rows } = await pool.query(queryUser);
		return rows;
	} catch (error) {
		throw error;
	}
};

// const addProductToCart = async (id) => {
// 	try {
// 		const queryProduct =
// 			"SELECT id, product_name, stock, price FROM product WHERE id = $1";
// 		const idProduct = [id];

// 		const { rows } = await pool.query(queryProduct, idProduct);
// 		const selectProduct = rows;

// 		if (!id) {
// 			throw { code: "404" };
// 		}

// 		if (selectProduct.length > 0) {
// 			const updateQuery =
// 				"UPDATE shopping_cart_detail SET quantity = $1 WHERE product_id = $2";

// 			const updateQuantity =
// 				selectProduct[0].quantity === 0 ? 1 : selectProduct[0].quantity + 1;
// 			const updateProduct = [updateQuantity, id];
// 			const { rows } = await pool.query(updateQuery, updateProduct);
// 			return rows[0];
// 		}
// 		// return selectProduct;
// 	} catch (error) {
// 		throw error;
// 	}
// };

export const myModels = { allUsers };
