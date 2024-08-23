// src/app.js
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const User = require('./models/user');
require('./db/conn');

const app = express();
const port = process.env.PORT || 3000;

//public static path
const static_path= path.join(__dirname, "../public");
const template_path= path.join(__dirname, "../tamplates/views") 
const partials_path = path.join(__dirname, "../templates/partials")
// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path));
app.use(bodyParser.json())

app.set(`view engine`, `hbs`);
app.set(`views`, template_path);
hbs.registerPartials(partials_path);

// Routes

// Register Page
app.get('/', (req, res) => {
    res.render('register');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Handle Registration
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('register', { error: 'Passwords do not match' });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && user.password === password) {
            res.redirect(`/profile?username=${user.username}`);
        } else {
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).send('Error logging in user');
    }
});

// Profile Page
app.get('/profile', (req, res) => {
    const { username } = req.query;
    res.render('mine', { username });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
