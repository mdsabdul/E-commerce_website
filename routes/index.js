var express = require('express');
var router = express.Router();
const Cart = require("../model/cartmodel");
const Product = require("../model/productmodel");
const { aboutpage, contactpage, cartpage, accountpage,placedorder } = require("../controllers/indexcontroller");
const { createproducts, createitem, productpage } = require("../controllers/productcontroller");
const { isLoggedin } = require("../controllers/usercontroller");
const { use } = require('passport');

//payment gateway

const Razorpay = require("razorpay");
const { model } = require('mongoose');
var instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

router.post("/create/orderId", async(req,res,next)=>{

 try {
const User = require("../model/usermodel")
const cart = require("../model/cartmodel")

   const detail = await cart.findOne({user : req.user._id}).populate("user").populate({path:"product",model:"product"}).exec()
  let totalamount = 0
  detail.product.forEach(item =>{
     totalamount += parseFloat(item.price)
     
  })
 
  var options = {
    amount: totalamount * 100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: `${req.user._id}`
  };
  instance.orders.create(options, function(err, order) {
    if(err){
      res.send("something Went Wrong")
    }
    console.log(order);
    res.send(order)
  });
 } catch (error) {
  res.send(error)
 }
})
router.post("/api/payment/verify",(req,res,next)=>{
  const razorpayPaymentId = req.body.razorpay_payment_id;
  const razorpayOrderId = req.body.razorpay_order_id;
  const razorpaySignature = req.body.razorpay_signature;

  const secret = process.env.key_secret;

  const generatedSignature =(razorpayOrderId + '|' + razorpayPaymentId ,secret,razorpaySignature)
   

  if (generatedSignature === razorpaySignature) {
    res.send({ status: 'success' });
  } else {
    res.send({ status: 'failure' });
  }
 
})

/* GET home page. */
router.get('/', isLoggedin, async function (req, res, next) {
    try {
     
        const newcart = await Cart.findOne({user:req.user._id})
       
        res.render('index', {user:req.user, newcart });
    } catch (error) {
        res.send(error)
    }
});
router.get("/placeorder",placedorder)
router.get("/about", isLoggedin, aboutpage);
router.get("/product", productpage);
router.get("/contact", contactpage);
router.get("/cart", isLoggedin, cartpage);
router.get("/account", isLoggedin, accountpage);

router.get("/logout", (req, res, next) => {
    if (req.logOut) {
        res.redirect("/users/login");
    }
});

router.get("/createproduct", createproducts);
router.post("/createitem", createitem);

router.get("/addtocart/:id", isLoggedin, async function (req, res, next) {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id
            });
        }

        const product = await Product.findById(req.params.id);

        if (product) {
            const productExistIntheCart = cart.product.includes(product._id)
            if (!productExistIntheCart) {

                cart.product.push(product._id);
                req.user.cart.push(product._id);
                await cart.save();
                await req.user.save()
              
            }
        }
        res.redirect("/cart");
    } catch (error) {
        res.send(error.message);
    }
});
router.get("/delete/:id", isLoggedin, async function (req, res) {
    try {
        const user = req.user
        const cart = await Cart.findOne({ user: req.user._id })
        cart.product = cart.product.filter(productid => productid.toString() !== req.params.id)
        user.cart = user.cart.filter(productid => productid.toString() !== req.params.id)
        await cart.save();
        await user.save()
        res.redirect("/cart")
    } catch (error) {
        res.send(error)
    }
})
router.get("/remove/:id", async function(req,res){
try {
    const user = req.user
 
  const deletedproduct =  await Product.findByIdAndDelete(req.params.id)
  const cart = await Cart.findOne({ user: req.user._id })
  
  if(deletedproduct){
    
    user.cart = user.cart.filter(productid => productid.toString() !== deletedproduct._id)
    await user.save()
  }

 
    res.redirect("/product")
} catch (error) {
    res.send(error)
}
})
module.exports = router;
