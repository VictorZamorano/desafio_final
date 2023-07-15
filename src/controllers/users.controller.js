import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { usersModel } from '../models/users.model.js';
import { handleErrors } from '../helpers/users.errors.js';

//GENERA TOKEN SI SE VERIFICA LA EXISTENCIA DEL USUARIO Y LA CONTRASENA
const tokenGen = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw { code: '400' };
    }
    const result = await usersModel.readUser(email);
    if (result === '404') {
      throw { code: '404' };
    } else if (result === '411') {
      throw { code: '411' };
    } else if (result.name === 'error') {
      throw { code: result.code, message: result.message };
    }
    const verifyPass = await bcrypt.compare(password, result.password);
    if (!verifyPass) {
      throw { code: '401' };
    }
    const token = jwt.sign(
      { email, password, role: result.role },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: '1h',
      }
    );
    res.json({ token });
  } catch (error) {
    const { status, message } = handleErrors(error.code, error.message);
    res.status(status).json({ status, message });
  }
};

//CREA USUARIO SI SE VERIFICA LA NO EXISTENCIA DE EMAIL Y SI CLAVE CUMPLE CON REQUISITOS
const generateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw { code: '400' };
    }
    if (password.length < 8 || password.length > 20) {
      throw { code: '403' };
    }
    const hashPass = await bcrypt.hash(password, 10);
    const result = await usersModel.createUser(email, hashPass);
    if (result.name === 'error') {
      throw { code: result.code, message: result.message };
    }
    return res.json({ message: 'Creado. Intente logear' });
  } catch (error) {
    const { status, message } = handleErrors(error.code, error.message);
    res.status(status).json({ status, message });
  }
};

//ENTREGA USUARIO SI SE VERIFICA LA EXISTENCIA DE ESTE Y DE LA AUTORIZACION
const getUser = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await usersModel.readUser(email);
    if (result === '404') {
      throw { code: '404' };
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

//EDITA USUARIO DE UN CAMPO A LA VEZ, PREVIA VALIDACION DE ROL
const editUser = async (req, res) => {
  const { email, password, userToEdit, param, newParam } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const role = jwt.verify(token, process.env.JWT_PRIVATE_KEY).role;
  try {
    if (!userToEdit || !param || !newParam) {
      throw { code: '405' };
    }
    if (role === 'user') {
      if (email === userToEdit) {
        if (param === 'id' || param === 'role' || param === 'created_at') {
          throw { code: '406' };
        }
      } else {
        throw { code: '407' };
      }
    }
    if (param === 'password') {
      newParam = await bcrypt.hash(password, 10);
    }
    const result = await usersModel.updateUser(userToEdit, param, newParam);
    if (result === '404') {
      throw { code: '404' };
    } else if (result.name === 'error') {
      throw { code: result.code, message: result.message };
    }
    res.json(result);
  } catch (error) {
    const { status, message } = handleErrors(error.code, error.message);
    res.status(status).json({ status, message });
  }
};

export const usersController = {
  tokenGen,
  getUser,
  generateUser,
  editUser,
};
