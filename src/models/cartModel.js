import { pool } from "../db/connection.js";
import { productModel } from "./productModel.js";


const getCartGeneralData = async (user_account_id) => {
	try {
		// ifUserIdExist(user_account_id)
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

const getJsonFormCart = async (shoppingCart) => {
	try {
		console.log(shoppingCart)
		// const shoppingCart = await getCartGeneralData(user_account_id);
		if(shoppingCart.length > 0){
			const cartDetails = await getCartDetails(shoppingCart[0].id);
			let totalPrice = 0;

			cartDetails.forEach((product) => {
				totalPrice += product.price_x_quantity;
			});

			const cart = {
				id: shoppingCart[0].id,
				user_account_id: shoppingCart[0].user_account_id,
				total_price: totalPrice,
				product: cartDetails
			};
			return cart;
		}
		else {
			throw {code: "404"};
		}
	} catch (error) {
		throw error;
	}
}

const getCart = async (user_account_id) => {
	try {
		const shoppingCart = await getCartGeneralData(user_account_id);
		const cart = await getJsonFormCart(shoppingCart)
		return cart
	} catch (error) {
		throw error;
	}
}


const addProductToCart = async (user_account_id, product) => {
	try {
		let shoppingCart = await getCartGeneralData(user_account_id);

		// Primero buscamos si existe un carro para el usuario, de no ser así, lo crearemos desde 0
		if(shoppingCart.length > 0) {
			// Caso carro existe
			await addProductToExistingCart(shoppingCart, product)
		} else {
			// Caso carro no existe
			await createNewCart(user_account_id, product);
			shoppingCart = await getCartGeneralData(user_account_id);	
		}
		const cart = await getJsonFormCart(shoppingCart)
		return cart

	} catch (error) {
		throw error;
	}
};


const totalPriceForProduct = async (product_id, quantity) =>{
	const productQuery = "SELECT id, price FROM product WHERE id = $1"
	const { rows } = await pool.query(productQuery, [product_id])
	
	const totalPrice = rows[0].price * quantity 
	console.log(totalPrice)
	return totalPrice
}


// FUNCTION HELPER FOR addProductToExistingCart AND removeProductOnCart
const existingProductQuantity = async(shopping_cart_id, product) =>{
	const existingProductQuery = "SELECT quantity FROM shopping_cart_detail WHERE shopping_cart_id = $1 AND product_id = $2";
	const existingProductResult = await pool.query(existingProductQuery, [shopping_cart_id, product]);
	const existingQuantity = existingProductResult.rows.length > 0 ? existingProductResult.rows[0].quantity : 0;
	return existingQuantity
}

// FUNCTION HELPER FOR addProductToExistingCart AND removeProductOnCart
const updateProductOnCart = async (newQuantity, shopping_cart_id, product) =>{
	
	// Si el producto ya existe en el cart, actualiza la cantidad
	const updateQuantityQuery = "UPDATE shopping_cart_detail SET quantity = $1 WHERE shopping_cart_id = $2 AND product_id = $3";
	await pool.query(updateQuantityQuery, [newQuantity, shopping_cart_id, product]);
	
	// Actualiza el precio total
	const totalPrice = await totalPriceForProduct(product, newQuantity);
	const updatePriceQuery = "UPDATE shopping_cart_detail SET total_price = $1 WHERE shopping_cart_id = $2 AND product_id = $3";
	await pool.query(updatePriceQuery, [totalPrice, shopping_cart_id, product]);
}


const addProductToExistingCart = async (shopping_cart_id, product) => {

	try {
		const existingQuantity = await existingProductQuantity(shopping_cart_id[0].id, product[0].product_id)
		console.log("existingQuantity", existingQuantity)
	
	
		// Const creada para sumar productos 
		const newQuantity = existingQuantity + product[0].quantity;

    if (existingQuantity > 0) {
      // Si el producto ya existe en el carrito, actualiza la cantidad
	  await updateProductOnCart (newQuantity, shopping_cart_id[0].id, product[0].product_id)
    } else {
      // Si el producto no existe en el carrito, añádelo como un nuevo detalle
      const insertQuery = "INSERT INTO shopping_cart_detail (shopping_cart_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)";
      const totalPrice = await totalPriceForProduct(product[0].product_id, product[0].quantity);
      const insertValues = [shopping_cart_id[0].id, product[0].product_id, product[0].quantity, totalPrice];
      await pool.query(insertQuery, insertValues);
    }

	} catch (error) {
		throw error
	}
}

const createNewCart = async (user_account_id, product) => {
	try {
		let cart_total_price = 0;
		// Calculamos el total del nuevo carro
		const product_detail = await Promise.all(product.map(async (prod) => {
			const prod_detail = await productModel.getProduct(prod.product_id);
			if(prod_detail.length > 0) {
				cart_total_price += (prod.quantity * prod_detail[0].price); /* cantidad del producto seleccionado por usuario * precio del producto existente */
				const cart = { // Esto se hace para aprovechar el llamado a la tabla producto y llenar esta lista con los datos necesarios para ingresar el detalle del carro
					product_id: prod.product_id,
					quantity: prod.quantity,
					total_price: (prod.quantity * prod_detail[0].price)
				}
				if(!cart){
					throw {code: "400"}
				} // ESTABA REVISANDO ESTO
				return cart;
			
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

const deleteProductFromCart = async (user_account_id, product) => {
	try {
	  let shoppingCart = await getCartGeneralData(user_account_id);
  
	  await removeProductOnCart(shoppingCart, product, user_account_id);
  
	  shoppingCart = await getCartGeneralData(user_account_id);
	  const updatedCart = await getJsonFormCart(shoppingCart);
  
	  if (updatedCart.product.length === 0) {
		// Si no hay productos en el carrito, eliminar el carrito por completo
		const deleteQuery = "DELETE FROM shopping_cart WHERE user_account_id = $1";
		await pool.query(deleteQuery, [user_account_id]);
		// REVISAR ESTO, VER CODE Y MESSAGE
		return {message: "Tu carro se encuentra vacio, debes agregar productos para visualizarlos"};
	  }
  
	  return updatedCart;
	} catch (error) {
	  throw error;
	}
  };


const removeProductOnCart = async (shopping_cart_id, product, user_account_id) => {
	try {
	  const existingQuantity = await existingProductQuantity(shopping_cart_id[0].id, product[0].product_id);
  
	  // Cantidad restante después de eliminar el producto
	  const newQuantity = existingQuantity - product[0].quantity;
  
	  if (newQuantity >= 1) {
		// Actualizar la cantidad y el precio total del producto
		await updateProductOnCart(newQuantity, shopping_cart_id[0].id, product[0].product_id);
	  } else {
		// Eliminar el producto del carrito
		const deleteProductQuery = "DELETE FROM shopping_cart_detail WHERE shopping_cart_id = $1 AND product_id = $2";
		await pool.query(deleteProductQuery, [shopping_cart_id[0].id, product[0].product_id]);
	  }
  
	  const updatedShoppingCart = await getCartGeneralData(user_account_id);
	  const cart = await getJsonFormCart(updatedShoppingCart);
	  return cart;
	} catch (error) {
	  throw error;
	}
  };


export const cartModel = { getCart, addProductToCart, deleteProductFromCart}
