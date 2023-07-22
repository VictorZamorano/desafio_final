import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { handleErrors } from "../helpers/users.errors.js";
dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) {
      throw { code: "402" };
    }
    const token = bearerHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    req.email = payload.email;
    req.id = payload.id;
    next();
  } catch (error) {
    const { status, message } = handleErrors(error.code, error.message);
    res.status(status).json({ status, message });
  }
};
