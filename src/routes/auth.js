// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
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

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
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

router.get('/profile', (req, res) => {
    const { username } = req.query;
    res.render('mine', { username });
});

module.exports = router;
