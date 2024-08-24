// src/app.js
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
require('./db/conn');

dotenv.config()
const app = express();
const port = process.env.PORT || 3000;

//public static path
const static_path= path.join(__dirname, "../public");
const template_path= path.join(__dirname, "../public/tamplates/views") 
const partials_path = path.join(__dirname, "../public/templates/partials")
// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path));
app.use(bodyParser.json())

app.set(`view engine`, `hbs`);
app.set(`views`, template_path);
hbs.registerPartials(partials_path);

// Routes
app.get('/', (req, res) => {
    res.render('register');
});
app.use('/', authRoutes);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
