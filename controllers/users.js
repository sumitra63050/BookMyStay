const User = require("../models/user.js");

module.exports.renderSignForm = ((req,res)=>{
    res.render("users/signup.ejs");
});

module.exports.signup  = (async(req , res) => {
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
    
});

module.exports.renderLoginForm  = ((req,res) => {
    res.render("users/login.ejs");
});


module.exports.login  = (async(req,res) => {
        req.flash("success" , "Welcome to BookMyStay you are logged in !")
        let redirectUrl = res.locals.redirectUrl || "/listings";//login condition me isLoggedIn function ko call hua hi nhi hai
        res.redirect(redirectUrl);
    });


module.exports.logout = ((req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    });
});