const express = require('express');
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/users.js")

/*for signup*/
/* router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
}); */

router.get("/signup" , userController.renderSignForm);

/* router.post("/signup" , wrapAsync(async(req , res) => {
    try{
     let {username , email , password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser , password);
    //console.log(registeredUser);
    req.login(registeredUser , (err) => {//automatic singup karne per login karne ke liye
        if(err) {
            return next(err);
        }
        req.flash("success" , "Welcome to BookMyStay!");
    res.redirect("/listings");
    });
    
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
    
})); */

router.post("/signup" , wrapAsync(userController.signup));

/*for login*/
/* router.get("/login" , (req,res) => {
    res.render("users/login.ejs");
}); */

router.get("/login" , userController.renderLoginForm);

/* router.post("/login" , saveRedirectUrl, passport.authenticate("local" , {
    failureRedirect: "/login",failureFlash:true,
}),
    async(req,res) => {
        req.flash("success" , "Welcome to BookMyStay you are logged in !")
        let redirectUrl = res.locals.redirectUrl || "/listings";//login condition me isLoggedIn function ko call hua hi nhi hai
        res.redirect(redirectUrl);
    }
); */

router.post("/login" , saveRedirectUrl, passport.authenticate("local" , {
    failureRedirect: "/login",failureFlash:true,
}),userController.login);


/* router.get("/logout" , (req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    });
}); */

router.get("/logout" ,userController.logout);

module.exports = router;