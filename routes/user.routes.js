const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/register', (req, res) => {
    res.render('register');
})
router.post('/register',
    body('username').trim().isLength({ min: 3 }),
    body('email').trim().isLength({ min: 13 }).isEmail(),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array(), message: 'validation error' });
        }
        const { username, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        try {
            await userModel.create({
                username,
                email,
                password: hashPassword
            });
            res.status(201).json({ message: 'user created successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }

    })
router.get('/login', (req, res) => {
    res.render('login');
})
router.post('/login',
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({
                error: error.array(),
                message: 'Invalid Input'
            })
        }
        const { username, password } = req.body
        try {
            const user = await userModel.findOne({ 
                username
             });
            if (!user) {
                res.status(400).json({
                    message: 'username and password does not match'
                })
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch){
                    res.status(400).json({
                        message: 'username and password does not match'
                    })
                }
                const token = jwt.sign({
                     userid: user._id,
                     username: user.username,
                     email: user.email
                    },
                    process.env.JWT_SECRET,
                );
                res.cookie('token',token);
                res.send("logged in")
            
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
router.get('/test', (req, res) => {
    res.send('test');
})

module.exports = router;