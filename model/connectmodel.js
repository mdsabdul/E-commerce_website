const mongoose = require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.mongo_url).then(()=>console.log("connected")).catch((error)=>console.log(error.message))