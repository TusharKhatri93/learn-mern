const mongoose = require("mongoose");

const connectDb = async()=>{
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected successfully");
    }
    catch(err){
        console.error("DB connection failed"+err.messsage);
        process.exit(1);
    }
};

module.exports = connectDb;



