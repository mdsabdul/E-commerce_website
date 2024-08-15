const Cart = require("../model/cartmodel")
const product = require("../model/productmodel")
exports.productpage = async (req, res) => {
  try {
    const allproducts = await product.find().populate("user")
    const newcart = await Cart.findOne({ user: req.user._id })
    res.render("products", { user: req.user, allproducts, newcart })
  } catch (error) {
    res.send(error)
  }
}
exports.createproducts = async (req, res) => {
  try {
    res.render("createproduct", { user: req.user })
  } catch (error) {
    res.send(error)
  }
}
exports.createitem = async (req, res) => {
  try {
    const { title, price, productimage } = req.body
    const item = await new product({
      title: req.body.title,
      price: req.body.price,
      productimage: req.body.productimage,
      user: req.user._id
    })
    await item.save()
    res.redirect("/product")
  } catch (error) {
    res.send(error)
  }
}