import * as dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { handleErrors } from "../db/errors.js";

const verifyToken = (req, res, next) => {
	try {
		const tokenHeader = req.headers.authorization;

		if (!tokenHeader) {
			throw {
				message: "Se necesita validar tu token para realizar esta acción",
			};
		}

		const token = tokenHeader.split(" ")[1];

		const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

		req.email = payload.email;
		next();
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

export const myMdleWare = { verifyToken };
