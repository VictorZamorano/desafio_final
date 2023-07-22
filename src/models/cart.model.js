import { pool } from "../db/connection.js";
import { productsModel } from "./products.model.js";

// Obtiene la data del shopping_cart
const getCartGeneralData = async (user_account_id) => {
	try {
		const queryCart = "SELECT id, user_account_id, total_price FROM shopping_cart WHERE user_account_id = $1"

		const {rows} = await pool.query(queryCart, [user_account_id]);

		return rows 

	} catch (error) {
		throw error;
	}
}

// Obtiene los detalles de shopping_cart y shoppung_cart_detail
const getCartDetails = async (shopping_cart_id) => {
	try {
		const queryCartDetails = "SELECT product.product_name, cartdetail.product_id, cartdetail.quantity as product_quantity,cartdetail.total_price as price_x_quantity, product.image_url FROM shopping_cart cart INNER JOIN shopping_cart_detail cartdetail ON cart.id = cartdetail.shopping_cart_id INNER JOIN product ON cartdetail.product_id = product.id INNER JOIN user_account useracc ON cart.user_account_id = useracc.id WHERE cartdetail.shopping_cart_id = $1"
		const { rows } = await pool.query(queryCartDetails, [shopping_cart_id]);
		return rows;
	} catch (error) {
		throw error;
	}

}

// Da formato a la respuesta
const getJsonFormCart = async (shoppingCart) => {
	try {
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
			throw {code: "404.1"};
		}

	} catch (error) {
		throw error;
	}
}

// Obtiene el cart del usuario
const getCart = async (user_account_id) => {
	try {
		const shoppingCart = await getCartGeneralData(user_account_id);

		const cart = await getJsonFormCart(shoppingCart)

		return cart
	} catch (error) {
		throw error;
	}
}

// Agrega los productos y/o aumenta la cantidad
const addProductToCart = async (user_account_id, product) => {
	try {
		let shoppingCart = await getCartGeneralData(user_account_id);

		const existProduct = await availableProduct(product)
		
		if(!existProduct){
			throw {code: "404.5"}
		}
		if(existProduct.length === 0){
			throw {code: "404.3"}
		}

		const stockAvailable = await stockProduct(product)
		
		if(stockAvailable){
			// Primero buscamos si existe un carro para el usuario, de no ser así, lo crearemos desde 0
			
			if(shoppingCart.length > 0) {
				// Caso carro existe
				await addProductToExistingCart(shoppingCart, product)
				
			} else {
				// Caso carro no existe
				await createNewCart(user_account_id, product);
				shoppingCart = await getCartGeneralData(user_account_id);	
			}
			// Tengo que llamar a una funcíon para bajar el stock del producto
			const cart = await getJsonFormCart(shoppingCart)
			return cart
		} else {
			throw {code: "404.4"}
		}

	} catch (error) {
		throw error;
	}
};

// Verifica el stock del producto
// FALTA OPTIMIZACION PARA CUANDO YA EXISTE EL PRODUCTO EN EL CARRO ENVIE THROW DE QUE SE SUPERO LA CANTIDAD DE STOCK 
const stockProduct = async(product) => {
	try {
		 const stockQuery = "SELECT stock FROM product WHERE id = $1"
		 const {rows} = await pool.query(stockQuery, [product[0].product_id])
		 return product[0].quantity <= rows[0].stock
	} catch (error) {
		throw error;
	}
}

// FUNCTION HELPER FOR addProductToExistingCart AND removeProductOnCart
const availableProduct = async(product) => {
	try {
		 const availableQuery = "SELECT id FROM product WHERE id = $1"
		 const result = await pool.query(availableQuery, [product[0].product_id])

		 return result
	} catch (error) {
		throw error;
	}
}

// FUNCTION HELPER FOR addProductToExistingCart AND removeProductOnCart
const totalPriceForProduct = async (product_id, quantity) =>{
	const productQuery = "SELECT id, price FROM product WHERE id = $1"

	const { rows } = await pool.query(productQuery, [product_id])
	const totalPrice = rows[0].price * quantity 
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

// Agrega un producto a un carro existente (esto es siempre y cuando exista un producto)
// FUNCTION HELPER FOR addProductToExistingCart
const addProductToExistingCart = async (shopping_cart_id, product) => {

	try {
		const existingQuantity = await existingProductQuantity(shopping_cart_id[0].id, product[0].product_id)
	
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

// Crea un nuevo cart
// FUNCTION HELPER FOR addProductToExistingCart
const createNewCart = async (user_account_id, product) => {
	try {
		let cart_total_price = 0;
		// Calculamos el total del nuevo carro
		const product_detail = await Promise.all(product.map(async (prod) => {
			
			const prod_detail = await productsModel.readProduct(prod.product_id);

			if(prod_detail) {
				cart_total_price += (prod.quantity * prod_detail.price);
				const cart = { 
					product_id: prod.product_id,
					quantity: prod.quantity,
					total_price: (prod.quantity * prod_detail.price)
				}
				return cart;
			
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

// Crea un shopping_cart_detail con los productos enviados
const createNewCartDetail = async (user_account_id, shopping_cart_id, product_detail) => {
	try {
		const query = "INSERT INTO shopping_cart_detail (shopping_cart_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)";
		
		product_detail.forEach((product_det) => {
			pool.query(query, [shopping_cart_id, product_det.product_id, product_det.quantity, product_det.total_price]);
		});
	} catch (error) {
		throw error;
	}
};

// FUNCTION HELPER FOR addProductToExistingCart AND removeProductOnCart
const existProductOnUserCart = async (user_account_id, product) =>{
	const userCart = await getCart(user_account_id)
	const productOnCart = userCart.product
	
	const existOnCart = productOnCart.find(p => {
		if(p.product_id === product){
			return true
		}
		return false
	})
	return Boolean(existOnCart)
};


// ELIMINA LOS PRODUCTOS DEL CARRO O ELIMINA EL CARRO EN CASO DE NO TENER ALGUN PRODUCTO
const deleteProductFromCart = async (user_account_id, product) => {
	try {
	  let shoppingCart = await getCartGeneralData(user_account_id);

	  const productOnCart = await existProductOnUserCart(user_account_id, product[0].product_id)
	  const existProduct = await availableProduct(product)
		if(!existProduct){
			throw {code: "404.5"}
		}

		if(!productOnCart){
			throw {code: "404.6"}
		}

	  await removeProductOnCart(shoppingCart, product, user_account_id);
  
	  shoppingCart = await getCartGeneralData(user_account_id);
	  const updatedCart = await getJsonFormCart(shoppingCart);
  
	  if (updatedCart.product.length === 0) {
		// Si no hay productos en el carrito, eliminar el carrito por completo
		const deleteQuery = "DELETE FROM shopping_cart WHERE user_account_id = $1";
		await pool.query(deleteQuery, [user_account_id]);
		// REVISAR ESTO, VER CODE Y MESSAGE
		return {code: "404.1", message: "Tu carro se encuentra vacio, debes agregar productos para visualizarlos"};
	  }
  
	  return updatedCart;
	} catch (error) {
	  throw error;
	}
  };

// Remueve el producto del carro y/o reduce la cantidad
const removeProductOnCart = async (shopping_cart_id, product, user_account_id) => {
	try {
	  const existingQuantity = await existingProductQuantity(shopping_cart_id[0].id, product[0].product_id);
  
	  // Cantidad restante después de eliminar el producto
	  const newQuantity = existingQuantity - product[0].quantity;
  
	  if (newQuantity >= 1) {
		// Actualizar la cantidad y el precio total del producto
		await updateProductOnCart(newQuantity, shopping_cart_id[0].id, product[0].product_id);
	  } else {
		// Eliminar el producto del cart
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
