import { pool } from "../db/connection.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const registerNewUser = async (email, password) => {
	try {
		const registerQuery =
			"INSERT INTO user_account (email, password) VALUES ($1, $2) RETURNING *";

		if (!email || !password) {
			throw { code: "400" };
		}
		// VALIDACION DE EMAIL YA SE ENCUENTRA EN USO?
		const hashPassword = await bcrypt.hash(password, 10);

		const newUser = [email, hashPassword];

		const { rows } = await pool.query(registerQuery, newUser);

		const user = rows.map((row) => {
			return {
				email: row.email,
				password: row.password,
			};
		});
		console.log(user);
		return customer;
	} catch (error) {
		throw error;
	}
};

const loginUser = async (email, password) => {
	try {
		const emailExistQuery =
			"SELECT id, email, password FROM user_account WHERE email = $1";

		if (!email || !password) {
			throw { code: "400" };
		}

		// VERIFICATION EMAIL
		const {
			rows: [customerDB],
			rowCount,
		} = await pool.query(emailExistQuery, [email]);

		if (!rowCount) {
			throw { code: "404", message: "Este correo no se encuentra registrado" };
		}

		// VERITIFICATION PASSWORD
		const verifyPassword = await bcrypt.compare(password, customerDB.password);

		if (!verifyPassword) {
			throw { code: "404", message: "Contraseña incorrecta" };
		}

		const token = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY, {
			expiresIn: "1h",
		});

		// const customerId = customerDB.id;
		const userLogin = { email, token };
		return userLogin;
	} catch (error) {
		throw error;
	}
};

export const userModels = {registerNewUser, loginUser}