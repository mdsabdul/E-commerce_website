const mongoose = require("mongoose")
const product = mongoose.Schema({
    title:String,
    productimage:String,
    price:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    
})
module.exports = mongoose.model("product",product);