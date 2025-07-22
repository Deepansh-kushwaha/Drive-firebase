const dotenv = require('dotenv');
dotenv.config({debug:true});
const express = require('express');
const app = express();
const userRouter = require('./routes/user.routes');
const connectTodb = require('./config/db');
connectTodb();
app.set('view engine', 'ejs'); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/user', userRouter);
app.listen(3000, () => {
    console.log('server started at port 3000');
});