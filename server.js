const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'), 
    cert: fs.readFileSync('cert.pem'), 
  };

  https.createServer(options, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

const morgan = require('morgan');

// Create a writer for logging files
var path = require('path');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://localhost/", "'unsafe-inline'"],
      }
    }
  }));
  

app.use(express.json());


// Serve static files from the 'public' folder
app.use(express.static('public'));


const db = require('./db');

const { check } = require('express-validator');
const { validationResult } = require('express-validator');


// Route for user registration
app.post('/register', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
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
    const { title, content, author } = req.body;
    const query = `INSERT INTO posts (title, content, author) VALUES (?, ?, ?)`;
    db.run(query, [title, content, author], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, postId: this.lastID });
    });
});

const xss = require('xss');

app.get('/search', (req, res) => {
    let searchTerm = req.query.q;
    searchTerm = xss(searchTerm); // Sanitize the search term
    res.send(`Search results for: ${searchTerm}`);
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
    const hashedPassword = bcrypt.hashSync(password, saltRounds); // Hash the password
    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(query, [name, email, hashedPassword], function(err) {
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
