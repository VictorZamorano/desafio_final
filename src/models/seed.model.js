import { pool } from "../db/connection.js";
import fs from "fs";
import * as url from "url";
import path from "path";

export const runSeeder = async () => {
  // const sql = fs.readFileSync("src/database/seed.sql").toString();
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  const sql = fs
    .readFileSync(path.join(__dirname, "../db/script.sql"))
    .toString();
  return await pool.query(sql);
};