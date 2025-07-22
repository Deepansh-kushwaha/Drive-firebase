const express = require('express');
const router  = express.Router();
const {body, validationResult} = require('express-validator');
const userModel = require('../models/user.model');
router.get('/',(req,res)=>{
    res.render('index');
});
router.get('/register',(req,res)=>{
    res.render('register');
})
router.post ('/register', 
      body('username').trim().isLength({min:3}),
    body('email').trim().isLength({min:13}).isEmail(),
    body('password').trim().isLength({min:5}),
   async (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
       return res.status(400).json({error: error.array(),message : 'validation error'});
    }
    const {username,email,password} = req.body;
    try{
       await userModel.create({
            username: username,
            email: email,
            password: password
        });
        res.status(201).json({message : 'user created successfully'});
    }catch(err){
        res.status(500).json({message : err.message});  
    }
  
})
router.get('/test',(req,res)=>{
    res.send('test');
})

module.exports = router;