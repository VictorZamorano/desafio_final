import { handleErrors } from '../helpers/products.errors.js';
import { productsModel } from '../models/products.model.js';
import jwt from 'jsonwebtoken';

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productsModel.readProduct(id);
    if (result === '412') {
      throw { code: '412' };
    } else if (result === '411') {
      throw { code: '411' };
    } else if (result.name === 'error') {
      throw { code: result.code, message: result.message };
    }
    res.json(result);
  } catch (error) {
    const { status, message } = handleErrors(error.code, error.message);
    res.status(status).json({ status, message });
  }
};

const getAllProducts = async (req, res) => {
  const { limit = 10, sort, page = 1 } = req.query;
  try {
    const result = await productsModel.readAllProducts(limit, sort, page);
    if (result === '412') {
      throw { code: '412' };
    } else if (result === '411') {
      throw { code: '411' };
    } else if (result.name === 'error') {
      throw { code: result.code, message: result.message };
    }
    const results = result.map(item => ({
      name: item.product_name,
      href: `https://desafio-final-node.onrender.com/products/${item.id}`,
    }));
    res.json(results);
  } catch (error) {
    const { status, message } = handleErrors(error.code, error.message);
    res.status(status).json({ status, message });
  }
};

const getCategory = async (req, res) => {
  const { limit = 5, sort, page = 1 } = req.query;
  let { category } = req.params;
  console.log(category);
  try {
    switch (category) {
      case 'placas-madre':
        category = 1;
        break;
      case 'ram':
        category = 2;
        break;
      case 'discos':
        category = 3;
        break;
      case 'gabinetes':
        category = 4;
        break;
      case 'fuentes-poder':
        category = 5;
        break;
      case 'tarjetas-video':
        category = 6;
        break;
      case 'procesadores':
        category = 7;
        break;
      default:
        throw { code: '412' };
    }
    const result = await productsModel.readCategory(
      category,
      limit,
      sort,
      page
    );
    if (result === '412') {
      throw { code: '412' };
    } else if (result === '411') {
      throw { code: '411' };
    } else if (result.name === 'error') {
      throw { code: result.code, message: result.message };
    }
    const results = result.map(item => ({
      name: item.product_name,
      href: `https://desafio-final-node.onrender.com/products/${item.id}`,
    }));
    res.json(results);
  } catch (error) {
    const { status, message } = handleErrors(error.code, error.message);
    res.status(status).json({ status, message });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const { param, newParam } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const role = jwt.verify(token, process.env.JWT_PRIVATE_KEY).role;
  try {
    if (!id || !param || !newParam) {
      throw { code: '405' };
    }
    if (role === 'user') {
      throw { code: '407' };
    }
    const result = await productsModel.updateProduct(id, param, newParam);
    if (result === '412') {
      throw { code: '412' };
    } else if (result.name === 'error') {
      throw { code: result.code, message: result.message };
    }
    res.json(result);
  } catch (error) {
    const { status, message } = handleErrors(error.code, error.message);
    res.status(status).json({ status, message });
  }
};

const generateProduct = async (req, res) => {
  const { product_name, stock, price, image_url, category_id } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const role = jwt.verify(token, process.env.JWT_PRIVATE_KEY).role;
  try {
    if (!product_name || !stock || !price || !image_url || !category_id) {
      throw { code: '405' };
    }
    if (role === 'user') {
      throw { code: '407' };
    }
    const result = await productsModel.createProduct(
      product_name,
      stock,
      price,
      image_url,
      category_id
    );
    if (result.name === 'error') {
      throw { code: result.code, message: result.message };
    }
    return res.json({ message: 'Producto Creado', producto: result });
  } catch (error) {
    const { status, message } = handleErrors(error.code, error.message);
    res.status(status).json({ status, message });
  }
};

export const productsController = {
  getProduct,
  getAllProducts,
  getCategory,
  editProduct,
  generateProduct,
};
