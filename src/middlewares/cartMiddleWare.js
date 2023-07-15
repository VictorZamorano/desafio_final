import * as dotenv from "dotenv";
dotenv.config();

import { handleErrors } from "../db/errors.js";

// const ifUserIdExist = (req, res, next) => {
// 	try {
// 		const {id} = req.params
// // ES MAS FACIL HACER LA VALIDACION EN EL MODEL
// 		const user = 

//         if(id > 0){
            
//         }
// 		next();
// 	} catch (error) {
// 		console.log(error.message);
// 		const { status, message } = handleErrors(error.code);
// 		return res.status(status).json({ ok: false, result: message });
// 	}
// };