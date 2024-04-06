const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database file, or create it if it doesn't exist
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create 'users' table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Users table created.');
  }
});

// Create 'posts' table
db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Posts table created.');
  }
});

db.run('ALTER TABLE posts ADD COLUMN author TEXT', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Author added.');
  }
});

// Close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
