const mongoose = require('mongoose');

function connectTodb(){
    const uri = process.env.MONGO_URI
    if(!uri){
        throw new Error('MONGO_URI is not defined');
    }
    mongoose.connect(uri)
    .then(()=>{
        console.log('database connected');
    })
    .catch((err)=>{
        console.log(err);       
    });
}

module.exports = connectTodb;