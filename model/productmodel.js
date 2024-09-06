const mongoose = require("mongoose")
const product = mongoose.Schema({
    title:String,
    productimage:String,
    price:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    cart:{type:mongoose.Schema.Types.ObjectId,ref:"cart"}
})
module.exports = mongoose.model("product",product);