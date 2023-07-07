import { pool } from "../db/connection.js";
import format from "pg-format";

const createUser = async (email, password, role = "user", active = true) => {
  const query =
    "insert into user_account (active, email, password, role) values ($1, $2, $3, $4) returning *";
  try {
    const { rows } = await pool.query(query, [active, email, password, role]);
    return rows;
  } catch (error) {
    return error;
  }
};

const readUser = async (email) => {
  const query = "select * from user_account where email = $1";
  try {
    const { rows } = await pool.query(query, [email]);
    if (rows.length === 0) {
      throw "404";
    } else if (Object.keys(rows[0]).length === 0) {
      throw "411";
    }
    return rows[0];
  } catch (error) {
    return error;
  }
};


const updateUser = async (email, param, newParam) => {
  const query = "update user_account set %s = $1 where email = $2 returning *";
  const value = param;
  const formattedQuery = format(query, value);
  try {
    const { rows } = await pool.query(formattedQuery, [newParam, email]);
    console.log(rows);
    if (rows.length === 0) {
      throw "404";
    }
    return rows;
  } catch (error) {
    return error;
  }
};

export const usersModel = { createUser, readUser,  updateUser };
