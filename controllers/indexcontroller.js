const Cart = require("../model/cartmodel");
const nodemailer = require("nodemailer")
//nodemailer
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
       user: "mdsabdul088@gmail.com",
       pass: "nlza xyuf auys rayi"
    }
 })
exports.aboutpage = (req, res) => {
    res.render("about", { user: req.user })
}
exports.contactpage = (req, res) => {
    res.render("contact", { user: req.user })
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
        to: req.user.email,
        subject: "Order Placed Successfully",
        html: `<h1> pay by cash and get your order <br> Thank You for Shopping here <br> Come again ❤️</h1>`
     }
     transport.sendMail(mailOption, (error) => {
       if(error){
        return console.log(error);
        
       }
         console.log("mail sent");
         
     })
  res.render("placeorder")
}
