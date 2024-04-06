const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.serialize(() => {
  db.run(`DELETE FROM posts`, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('All posts have been deleted');
    }
  });

  db.run(`DELETE FROM sqlite_sequence WHERE name='posts'`, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Autoincrement counter for posts table has been reset');
    }
  });
});

db.close();
