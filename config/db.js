const mongoose = require('mongoose');



const db = process.env.DATABASE_URI 
mongoose.set('strictQuery', false);
mongoose.connect(db, (error)=>{
    if(error){
        console.log("Connection to database failed.");
    }else{
        console.log("Connection to database successful.");
    }
})