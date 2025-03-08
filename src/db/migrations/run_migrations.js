import "dotenv/config";
import fs from "fs";
import db_pool from "../connection.js";

const create_user_table_query = fs
  .readFileSync("src/db/migrations/create_user_table.sql")
  .toString();

async function runMigrations() {
  const client = await db_pool.connect();
  await client.query(create_user_table_query);
  client.release();
  await db_pool.end();
}

runMigrations();
