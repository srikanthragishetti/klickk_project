
import sqlite3 from "sqlite3"; 
sqlite3.verbose(); //  Enables detailed error logging and debugging information for SQLite operations.

const DB_PATH = "./users.db";  // Database file path
const db = new sqlite3.Database(DB_PATH, (err) => {          // Open (or create) database
  if (err) {
    console.error("Could not open database", err);
  } else {
    console.log("Connected to SQLite database:", DB_PATH);
  }
});

db.serialize(() => {                   //It makes sure all the SQL commands inside run sequentially, one after another.Without serialize(), SQLite3 may run queries in parallel (asynchronously), which can cause issues (like trying to query a table before it’s created).
  db.run(`                               
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
});

export default db;
