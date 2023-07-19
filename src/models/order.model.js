import { pool } from "../db/connection.js";
import { cartModel } from "./cart.model.js";

const genOrder = async (user_account_id) =>{
    try {
        const cart = await cartModel.getCart(user_account_id);
        if(cart.total_price === 0){
            // MODIFICAR EL CODE EN UN HANDLE ERROR
            throw {code: "400", message: "Debes añadir productos antes de poder generar tu orden"};
        } else{
            // Genera la fila user_order de la orden generada
            const orderQuery = "INSERT INTO user_order (user_account_id, total_price) VALUES ($1, $2) RETURNING id";
            const values =  [user_account_id, cart.total_price];
            const result = await pool.query(orderQuery, values);
            // Eliminar productos en el cart del usuario y los añade a la orden
            const order = await getOrderDetail(user_account_id, result.rows[0].id);
            return order;
        }
    } catch (error) {
        throw error;
    }
}
const getOrderDetail = async (user_account_id, user_order_id) =>{
    try {
        const cart = await cartModel.getCart(user_account_id);
    
        if(cart.product.length > 0){
            await insertProductToOrder(cart.product, user_order_id);
            await deleteShoppingCart(user_account_id);
        }
        return cart;
    } catch (error) {
       throw error 
    }
}

const deleteShoppingCart = async (user_account_id)=>{
    try {
        const deleteQuery = "DELETE FROM shopping_cart WHERE user_account_id = $1";
        await pool.query(deleteQuery, [ user_account_id]);
    } catch (error) {
       throw error;
    }

}

const insertProductToOrder = async (cart, user_order_id) =>{
    try {
        cart.forEach( async(product) =>{
            const insertQuery = "INSERT INTO order_detail (user_order_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)";
            const values = [user_order_id, product.product_id, product.product_quantity, product.price_x_quantity];
            await pool.query(insertQuery, values);
        })
    } catch (error) {
       throw error;
    }
}

export const orderModel = { genOrder, getOrderDetail };