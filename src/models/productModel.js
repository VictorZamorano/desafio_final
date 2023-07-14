import { pool } from "../db/connection.js";


const getProduct = async (product_id) => {
    try {
        const query = "SELECT id, product_name, stock, price, image_url, category_id FROM product WHERE id = $1"
        
    	const {rows} = await pool.query(query, [product_id]);

		return rows 
    } catch (error) {
        throw error;
    }
}

export const productModel = { getProduct }