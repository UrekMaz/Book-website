const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require("./UserSchema.js");
const NewBook = require("./NewBook.js");
const cookieparser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const session = require('express-session');
const {list} = require('./genre.js')
const {Alist} =require('./authors.js')
const qs = require('qs');
const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, sameSite: 'lax' } // Adjust as needed
}));

mongoose.connect('mongodb+srv://manual:nrtGC7D6tG2GjS1E@cluster0.60idrdx.mongodb.net/newTest?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

const bsalt = bcrypt.genSaltSync(10);

app.post('/uploadBook', upload.single('material'), async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    const { title, isbn, rating } = req.body;
    const material = req.file.filename;
    try {
        const newBook = await NewBook.create({
            title, isbn, rating, material
        });
        res.json(newBook);
    } catch (er) {
        console.log(er);
        res.status(422).json(er);
    }
});

app.get('/genres', async (req, res) => {
    console.log("entered");
    try {
      const categories = await list();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read the file' });
    }
  });

  app.get('/authors', async (req, res) => {
    console.log("entered authors");
    try {
      const categories = await Alist();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read the file' });
    }
  });

  

app.post('/register', async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    const { name, email, pwd } = req.body;
    try {
        const user = await User.create({
            name, email, pwd: bcrypt.hashSync(pwd, bsalt),
        });
        res.json(user);
    } catch (er) {
        res.status(422).json(er);
    }
});

const secretKey = "asdfgWEJyuVBTYUIjh";
app.post('/login', async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    const { email, pwd } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const passOK = bcrypt.compareSync(pwd, user.pwd);
            if (passOK) {
                jwt.sign({ id: user._id, email: user.email }, secretKey, {}, (err, token) => {
                    if (err) throw err;
                    req.session.user = user; // Store user in session
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: false, // Set to true in production (over HTTPS)
                        sameSite: 'Lax', // You can change this to 'Strict' or 'None' depending on your needs
                        maxAge: 24 * 60 * 60 * 1000 // 1 day
                    }).json(user);
                });
            } else {
                res.json("Invalid credentials");
            }
        } else {
            res.json("User Not found");
        }
    } catch (er) {
        res.status(422).json(er);
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secretKey, {}, async (err, user) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(user.id);
            res.json({ name, email, _id });
        });
        console.log("inside profile")
    } else if (req.session.user) {
        const { name, email, _id } = req.session.user;
        res.json({ name, email, _id });
        console.log("User found in session")
    } else {
        res.json("no token");
        console.log("Not inside profile")
    }
});

app.get('/test', (req, res) => {
    res.json("test ok");
});

app.post("/trends", async (req, res) => {
    const { genre, authors } = req.body;

    console.log('Received genre:', genre);
    console.log('Received authors:', authors);

    try {
        const response = await axios.get('http://localhost:5000/trends', {
            params: { genres: genre, authors: authors },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: 'repeat' });
            }
        });
        res.json(response.data);
        console.log(response.data)
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Error fetching recommendations' });
    }

});
app.get('/recommend_books', async (req, res) => {
    const user_input = req.query.query;
    console.log(user_input)
    try {
        const response = await axios.get('http://localhost:5000/recommend_books', {
            params: { query: user_input }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Error fetching recommendations' });
    }
});

app.post('/logout', (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});