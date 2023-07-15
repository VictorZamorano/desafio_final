import { pool } from "../db/connection.js";
import { productsModel } from "./products.model.js";


const getCartGeneralData = async (user_account_id) => {
	try {
		const queryCart = "SELECT id, user_account_id, total_price FROM shopping_cart WHERE user_account_id = $1"

		const {rows} = await pool.query(queryCart, [user_account_id]);

		return rows 

	} catch (error) {
		throw error;
	}
}

const getCartDetails = async (shopping_cart_id) => {
	try {
		const queryCartDetails = "SELECT product.product_name, cartdetail.product_id, cartdetail.quantity as product_quantity,cartdetail.total_price as price_x_quantity, product.image_url FROM shopping_cart cart INNER JOIN shopping_cart_detail cartdetail ON cart.id = cartdetail.shopping_cart_id INNER JOIN product ON cartdetail.product_id = product.id INNER JOIN user_account useracc ON cart.user_account_id = useracc.id WHERE cartdetail.shopping_cart_id = $1"
		
		const { rows } = await pool.query(queryCartDetails, [shopping_cart_id]);
		return rows;
	} catch (error) {
		throw error;
	}

}

const getCart = async (user_account_id) => {
	try {
		const shoppingCart = await getCartGeneralData(user_account_id);
		if(shoppingCart.length > 0){
			const cartDetails = await getCartDetails(shoppingCart[0].id);
			const cart = {
				id: shoppingCart[0].id,
				user_account_id: shoppingCart[0].user_account_id,
				total_price: shoppingCart[0].total_price,
				product: cartDetails
			  };
			  return cart
		} else {
			throw {code: "404"}
		}
	} catch (error) {
		throw error;
	}
}

/**
 * Validar que a esta función jamás llegue un llamado si es que no trae algún producto en la lista MIDDLEWARE
 * Validar que a esta función siempre le llegue un user_id que exista
 * {
 * 		user_account_id: 1,
 * 		product: [
 * 			{
 * 				product_id: 50000,
 * 				quantity: 5
 * 			}
 * 		]
 * }
 */
const addProductToCart = async (user_account_id, product) => {
	try {
		// Primero buscamos si existe un carro para el usuario, de no ser así, lo crearemos desde 0
		const shoppingCart = await getCartGeneralData(user_account_id);

		if(shoppingCart.length > 0) {
			// Caso carro existe
		} else {
			// Caso carro no existe
			await createNewCart(user_account_id, product);
		}

	} catch (error) {
		throw error;
	}
};

const createNewCart = async (user_account_id, product) => {
	try {
		let cart_total_price = 0;
		// Calculamos el total del nuevo carro
		const product_detail = await Promise.all(product.map(async (prod) => {
			const prod_detail = await productsModel.getProduct(prod.product_id);
			if(prod_detail.length > 0) {
				cart_total_price += (prod.quantity * prod_detail[0].price); /* cantidad del producto seleccionado por usuario * precio del producto existente */
				return { // Esto se hace para aprovechar el llamado a la tabla producto y llenar esta lista con los datos necesarios para ingresar el detalle del carro
					product_id: prod.product_id,
					quantity: prod.quantity,
					total_price: (prod.quantity * prod_detail[0].price)
				};
			
			} else {
				throw error;
			}
		}));

		// Creación del nuevo cart
		const query = "INSERT INTO shopping_cart (user_account_id, total_price) VALUES ($1, $2) RETURNING id";
		const result = await pool.query(query, [user_account_id, cart_total_price])

		// Creación del detalle de carro
		await createNewCartDetail(user_account_id, result.rows[0].id, product_detail);

	} catch (error) {
		throw error;
	}
}
const createNewCartDetail = async (user_account_id, shopping_cart_id, product_detail) => {
	try {
		const query = "INSERT INTO shopping_cart_detail (shopping_cart_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)";
		
		product_detail.forEach((product_det) => {
			pool.query(query, [shopping_cart_id, product_det.product_id, product_det.quantity, product_det.total_price]);
		});
	} catch (error) {
		throw error;
	}
}

const checkProductOnCart = (user_id, product_id) => {
	try {
		const query = "SELECT product_id FROM sh"
	} catch (error) {
		throw error;
	}
}


export const cartModel = { getCart, addProductToCart}
