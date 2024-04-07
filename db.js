// db.js
const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance = new sqlite3.Database('./blog.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Connected to the blog.db database.');
        }
      });
    }

    return Database.instance;
  }
}

module.exports = new Database();
