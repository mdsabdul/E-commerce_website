const User = require("../model/usermodel")
const nodemailer = require("nodemailer")
const passport = require("passport")
const localStretegy = require("passport-local")
passport.use(new localStretegy(User.authenticate()))

const transport = nodemailer.createTransport({
   service: "Gmail",
   auth: {
      user: "mdsabdul088@gmail.com",
      pass: "nlza xyuf auys rayi"
   }
})
exports.registerpage = (req, res) => {
   res.render("register")
}
exports.signup = async (req, res) => {
   try {
      const { name, email, username, image, password } = req.body
      const newuser = await User.register({ name, username, email, image }, password)
      const mailOption = {
         from: "mdsabdul088@gmail.com",
         to: email,
         subject: "Registration on Shorts",
         html: `Registration Successfully <br> welcome to our ecommerce plateform `
      }
      transport.sendMail(mailOption, (error) => {
        if(error){
         return console.log(error);
         
        }
          console.log("mail sent");
          
      })
      await newuser.save()
      res.redirect("/users/login")
   } catch (error) {
      res.send(error)
   }

}
exports.login = (req, res) => {
   res.render("login")
}
exports.signin = (passport.authenticate("local", {
   successRedirect: "/",
   failureRedirect: "/users/login"
}))

exports.isLoggedin = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   } else {
      res.redirect("/users/login")
   }
}
exports.changeprofile = (req, res, file) => {

}