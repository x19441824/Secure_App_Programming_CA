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
            res.json({ success: true, message: "Logged in successfully", userId: user.id });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// Route for creating a new blog post
app.post('/post', (req, res) => {
    const { title, content, author } = req.body; // Now including the author received from the request
    
    // Insert the new post with the provided title, content, and author into the database
    const query = 'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)';
    db.run(query, [title, content, author], function(err) {
        if (err) {
            // If an error occurs, send a 500 status code with the error message
            res.status(500).json({ error: err.message });
            return;
        }
        // On success, send back the ID of the newly created post
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

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

    // Check if user already exists
    db.get(`SELECT email FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.status(409).json({ error: "User already exists" });
        } else {
            // No user exists, create a new user
            db.run(query, [name, email, password], function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(201).json({ success: true, userId: this.lastID });
            });
        }
    });
});




// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
