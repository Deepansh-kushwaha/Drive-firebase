const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true,
        minLength: [3, 'username must be at least 3 characters long'],

    },
    email: {
        type : String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [13, 'email must be at least 13 characters long'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: [5, 'password must be at least 5 characters long'],
    }
});   

const user = mongoose.model('user', userSchema);
module.exports = user;