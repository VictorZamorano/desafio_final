import * as dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
	allowExitOnIdle: true,
});
