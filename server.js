const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Connect to the SQLite database
const db = new sqlite3.Database('./blog.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the blog.db database.');
});

// Define routes here

// Route for user registration
app.post('/register', (req, res) => {
    const { name, email, password } = req.body; // In a real app, you should hash the password!
    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

    db.run(query, [name, email, password], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ success: true, userId: this.lastID });
    });
});


// Route for user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

    db.get(query, [email, password], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (user) {
            res.json({ success: true, userId: user.id }); // Ideally, you should create a session or token here
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Route for creating a new blog post
app.post('/post', (req, res) => {
    const { title, content, user_id } = req.body;  // user_id can be undefined
    const query = `INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)`;
  
    db.run(query, [title, content, user_id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, postId: this.lastID });
    });
  });
  
  

// Route for fetching all blog posts
app.get('/posts', (req, res) => {
    const query = `SELECT * FROM posts`;

    db.all(query, [], (err, posts) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, posts: posts });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
