import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./src/routes/users.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", usersRouter);

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
	console.log("SERVER ON", "http://localhost:" + PORT);
});


