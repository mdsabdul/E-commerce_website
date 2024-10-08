const Cart = require("../model/cartmodel");
const nodemailer = require("nodemailer")
require("dotenv").config()
//nodemailer
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
       user: process.env.user,
       pass: process.env.pass
    }
 })
exports.aboutpage =async(req, res) => {
try {
    const cart = await Cart.findOne({ user: req.user._id })
    .populate("user")
    .populate({
        path: "product",
        model: "product"
    });
    res.render("about", { user:req.user,newcart:cart })
} catch (error) {
    res.send(error)
}

}
exports.contactpage = async(req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
        .populate("user")
        .populate({
            path: "product",
            model: "product"
        });
        res.render("contact", { user:req.user,newcart:cart })
    } catch (error) {
        res.send(error)
    }
}
exports.accountpage = (req, res) => {
    res.render("account", { user: req.user })
}


exports.cartpage = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("user")
            .populate({
                path: "product",
                model: "product"
            });
           
          
            
        if (!cart) {
            return res.render("cart", { user: req.user, newcart: null });
        }

        res.render("cart", { user: req.user, newcart: cart });
    } catch (error) {
        res.send(error.message);
    }
};

exports.placedorder=(req,res)=>{
    const user = req.user
    const mailOption = {
        from: "mdsabdul088@gmail.com",
        to:user.email,
        subject: "Order Placed Successfully",
        html: `<h1> Congratulations <br> Thank You for Shopping here <br> Come again ❤️</h1>`
     }
     transport.sendMail(mailOption, (error) => {
       if(error){
        return console.log(error);
        
       }
         console.log("mail sent");
         
     })
  res.render("placeorder")
}
