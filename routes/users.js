var express = require('express');
var router = express.Router();
const {registerpage,signup,login,signin,changeprofile}= require("../controllers/usercontroller");
const passport = require('passport');
const { route } = require('.');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/register",registerpage)
router.post("/register",signup)
router.get("/login",login)
router.post("/login",signin)
router.post("/profilechange",changeprofile)

module.exports = router;
