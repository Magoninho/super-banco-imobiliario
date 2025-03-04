import { DatabaseSync } from "node:sqlite";

export const db = new DatabaseSync("database.db");
