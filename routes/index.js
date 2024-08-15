var express = require('express');
var router = express.Router();
const Cart = require("../model/cartmodel");
const Product = require("../model/productmodel");
const { aboutpage, contactpage, cartpage, accountpage,placedorder } = require("../controllers/indexcontroller");
const { createproducts, createitem, productpage } = require("../controllers/productcontroller");
const { isLoggedin } = require("../controllers/usercontroller");

/* GET home page. */
router.get('/', isLoggedin, async function (req, res, next) {
    try {
        const newcart = await Cart.findOne({ user:req.user._id })
    //    console.log(newcart);
       
        res.render('index', { user: req.user, newcart });
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
        const cart = await Cart.findOne({ user: req.user._id })
        cart.product = cart.product.filter(productid => productid.toString() !== req.params.id)
        await cart.save();
        res.redirect("/cart")
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;
