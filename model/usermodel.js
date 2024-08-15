const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")
const usermodel = mongoose.Schema({
    name:String,
    username:String,
    email:String,
    image:String,
    password:String,
    cart:[{type:mongoose.Schema.Types.ObjectId,ref:"cart"}],
    product:{type:mongoose.Schema.Types.ObjectId , ref:"product"}
})
usermodel.plugin(plm)
module.exports = mongoose.model("user",usermodel)