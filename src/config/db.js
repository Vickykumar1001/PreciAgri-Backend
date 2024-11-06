require('dotenv').config();
const mongoose = require("mongoose")

const mongoDbUrl=process.env.DB_URL
const connectDb=()=>{
    return mongoose.connect(mongoDbUrl).
    then(console.log("Db connection OK")

    )
}

module.exports={connectDb}