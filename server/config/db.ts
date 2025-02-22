import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("test.db");

export function createTables() {
  db.exec(
    `
    CREATE TABLE IF NOT EXISTS rooms (
        room_id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_name TEXT,
        room_code TEXT,
        password TEXT
    );

    CREATE TABLE IF NOT EXISTS players (
        player_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT NOT NULL,
        has_set_nickname INTEGER NOT NULL DEFAULT 0,
        balance REAL NOT NULL DEFAULT 15000.0,
        socket_id TEXT NOT NULL UNIQUE,
        admin INTEGER NOT NULL DEFAULT 0,
        room_id INTEGER NOT NULL,
        FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
    );
    `,
  );
  
  db.close();
}
