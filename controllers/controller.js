import { handleErrors } from "../db/errors.js";
import { myModels, userModels } from "../models/models.js";

const getUsers = async (req, res) => {
	try {
		const getUsers = await myModels.allUsers();
		console.log(getUsers);
		res.status(200).json({ ok: true, result: getUsers });
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};
const postRegister = async (req, res) => {
	try {
		const { email, password } = req.body;

		const register = await userModels.registerNewUser(email, password);
		console.log(register);
		res.status(200).json({ ok: true, result: register });
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

const postLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const login = await userModels.loginUser(email, password);
		console.log(login);
		res.status(200).json({ ok: true, result: login });
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

const thisRouteNoExist = async (req, res) => {
	res.status(404).send({ message: "Esta ruta NO existe" });
};

export const myControllers = {
	getUsers,
	postRegister,
	postLogin,
	thisRouteNoExist,
};
