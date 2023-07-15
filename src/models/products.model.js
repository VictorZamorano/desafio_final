import { pool } from "../db/connection.js";
import format from "pg-format";

const createProduct = async (
  product_name,
  stock,
  price,
  image_url,
  category_id
) => {
  const query =
    "insert into product (product_name, stock, price, image_url, category_id) values ($1, $2, $3, $4, $5) returning *";
  try {
    const { rows } = await pool.query(query, [
      product_name,
      stock,
      price,
      image_url,
      category_id,
    ]);
    return rows;
  } catch (error) {
    return error;
  }
};

const readProduct = async (productID) => {
  const query =
    "SELECT id, product_name, stock, price, image_url, category_id FROM product WHERE id = $1";
  try {
    const { rows } = await pool.query(query, [productID]);
    if (rows.length === 0) {
      throw "404";
    } else if (Object.keys(rows[0]).length === 0) {
      throw "411";
    }
    return rows[0];
  } catch (error) {
    return error;
  }
};

const readAllProducts = async (limit, sort, page) => {
  let query = "SELECT id, product_name, stock FROM product";
  const queryProps = [];
  if (sort) {
    query += " ORDER BY %s %s";
    const [prop] = Object.keys(sort);
    queryProps.push(prop, sort[prop]);
  }
  if (limit) {
    query += " LIMIT %s";
    queryProps.push(limit);
  }
  if (page && limit) {
    query += " OFFSET %s";
    queryProps.push((page - 1) * limit);
  }
  try {
    const formattedQuery = format(query, ...queryProps);
    const { rows } = await pool.query(formattedQuery);
    if (rows.length === 0) {
      throw "404";
    }
    return rows;
  } catch (error) {
    return error;
  }
};

const readCategory = async (category, limit, sort, page) => {
  let query =
    "SELECT id, product_name, stock, price FROM product where category_id= $1";
  const queryProps = [];
  if (sort) {
    query += " ORDER BY %s %s";
    const [prop] = Object.keys(sort);
    queryProps.push(prop, sort[prop]);
  }
  if (limit) {
    query += " LIMIT %s";
    queryProps.push(limit);
  }
  if (page && limit) {
    query += " OFFSET %s";
    queryProps.push((page - 1) * limit);
  }
  try {
    const formattedQuery = format(query, ...queryProps);
    const { rows } = await pool.query(formattedQuery, [category]);
    if (rows.length === 0) {
      throw "404";
    }
    return rows;
  } catch (error) {
    return error;
  }
};

const updateProduct = async (id, param, newParam) => {
  const query = "update product set %s = $1 where id = $2 returning *";
  const value = param;
  const formattedQuery = format(query, value);
  try {
    const { rows } = await pool.query(formattedQuery, [newParam, id]);
    console.log(rows);
    if (rows.length === 0) {
      throw "404";
    }
    return rows;
  } catch (error) {
    return error;
  }
};

export const productsModel = {
  createProduct,
  readProduct,
  readAllProducts,
  readCategory,
  updateProduct,
};
