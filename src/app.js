const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const User = require('./models/register');
require('./db/conn');
const cors = require('cors');

const app = express();
//public static path
const static_path= path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials")
// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path));
app.use(cors({ origin: 'https://el-dorados.netlify.app' }));

app.set(`view engine`, `hbs`);
app.set(`views`, template_path);
hbs.registerPartials(partials_path);

app.get('/', (req, res) => {
  res.sendFile(path.join(static_path, 'register.html')); // Choose one to keep
});



app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});
app.get('/expe', (req, res) => {
  res.sendFile(path.join(static_path, 'expe.html'))
});

app.get('/', (req, res) => {
  res.sendFile(path.join(static_path, 'login.html'))
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(static_path, 'login.html'))
});


app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            res.redirect(`/mine?username=${user.username}`);
        } else {
            res.status(400).send('Invalid login credentials');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

// app.get('/mine', (req, res) => {
//     const username = req.query.username;
//     res.send('mine', { username });
// });

app.get('/mine', (req, res) => {
    res.sendFile(path.join(static_path, 'mine.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
