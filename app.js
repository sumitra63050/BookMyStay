if(process.env.NODE_ENV != "production"){
   require('dotenv').config();
}

//console.log(process.env.SECRET);

const express = require('express');
const app = express();
const mongoose = require('mongoose');
//const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
//const MONGO_URL = "mongodb://127.0.0.1:27017/bookstay";
const ejsMate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const {listingSchema} = require("./schema.js");
// const Review = require("./models/review.js");
// const {reviewSchema} = require("./schema.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

main().then(() =>{
    console.log("coneected to DB");
}).catch((err) =>{
    console.log(err);
});
async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}

app.use(cookieParser());
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto:{
         secret: "mysecretkey"
    },
    touchAfter: 24*3600,
  });

store.on("error" , ()=>{
    console.log("error in mongo session" , err);
});

const sessionOptions = {
    store, 
    secret: "mysecretkey", 
    resave: false,
    saveUninitialized:true,
    cookie :{
     expires: Date.now()+7*24*60*60*1000,
     maxAge:7*24*60*60*1000,
     httpOnly: true,
    },
};



// app.get("/" , (req,res)=>{
//     res.send("sucessful connnection");
// });

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user;//jo bhi user ka session chal rha hai uski info currUser variable me store kar denge
    next();
});

/*for passport*/
/* app.get("/demouser" , async(req,res)=>{
      let fakeUser = new User({
        email:"sumi123@gmail.com",
        username:"simitra",
      });

      let registeredUser = await User.register(fakeUser,"choudhary");
      res.send(registeredUser);
}); */

/*for express session*/ 
/* app.get("/testsession" , (req,res)=>{
    res.send("testing for express session");
}); */

/*storing and using info using express session*/
/* app.get("/register" , (req,res)=>{
    let {name = "anonymous" } = req.query;
    req.session.name = name;//session ke anadar information store kar others route me use karna 

    res.send(name);
});

app.get("/hello" , (req,res)=>{
    res.send(`hello, ${req.session.name}`);
});*/
 

/*for listing validate*/
/* const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);//used Joi 
     
     if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); 
     }else{
        next();
     }     
}; */


/*for review validate*/
/* const validateReview = (req , res , next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else {
      next();
    }
}; */

app.use("/listings" , listingRouter); // For listing Router
app.use("/listings/:id/reviews" , reviewRouter);//for review router
app.use("/" , userRouter);//for user Router

//cokoies 
/* app.get("/setcookies" , (req,res)=>{
    res.cookie("greet" , "namaste");
    res.send("this is setcookies");
});

app.get("/setcookies2" , (req,res)=>{
    res.send("this is setcookies2");

});

app.get("/setcookies3" , (req,res)=>{
    let {name= "sumitra"} = req.cookies;
    res.send(`hi ,${name}`);
});  */

/* //Index Route
 app.get("/listings" , wrapAsync(async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs" , {allListings});
})); 

//New Route
app.get("/listings/new" , (req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs" , {listing});
})); */


/* //create Route
app.post("/listings" , wrapAsync(async(req,res,next)=>{
     let result = listingSchema.validate(req.body);//used Joi 
     console.log(result);
     if(result.error){
        throw new ExpressError(400, result.error); 
     }
        //  if(!req.body.listing){
        //  throw new ExpressError(400, "send valid data for listing!");  
        //}  
      //let {title ,description, image, price, location , country} = req.body;
       const newListing = new Listing(req.body.listing);
     // if(!newListing.title){
        //  throw new ExpressError(400, "send valid data for listing!");  
        ///prevent Server side error like hoppscotch
     await newListing.save();
     res.redirect("/listings");
})); */

/* //create Route
app.post("/listings" ,validateListing, wrapAsync(async(req,res,next)=>{
       const newListing = new Listing(req.body.listing);
       await newListing.save();
       res.redirect("/listings");
}));

//Edit Route 
app.get("/listings/:id/edit", wrapAsync(async (req ,res) => {
      let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}));

//Update Route
app.put("/listings/:id" , validateListing,wrapAsync(async(req,res)=> {
      let {id} = req.params;
      await Listing.findByIdAndUpdate(id , {...req.body.listing});
      res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id" , wrapAsync(async (req , res)=>{
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     //console.log(deletedListing);
     
     res.redirect("/listings" );
})); */

//For Reviews
/* //post reviews
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
           let listing = await Listing.findById(req.params.id);
           let newReview = new Review(req.body.review);

           listing.reviews.push(newReview);

           await newReview.save();
           await listing.save();
           //req.flash("success" , "review was add !");
        res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req , res)=> {
       let { id , reviewId} = req.params;
       await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}}); //reviews ko listing se bhi delete karne ke liye
       await Review.findByIdAndDelete(reviewId);
       //req.flash("success" , " review was deleted !");
       res.redirect(`/listings/${id}`);
})); */

app.use((req,res,next)=>{
     next(new ExpressError(404, "page not found!"));
});

//Error Middleware
app.use((err,req,res,next)=>{
     let { statusCode=500,message= "something wrong"}=err;
     //console.log(err);
     res.status(statusCode).render("error.ejs" ,{message});
     //res.status(statusCode).send(message);
});
/* app.use((err,req,res,next)=>{
     res.send("something went wrong");
}); */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* app.listen(8080,()=>{
    console.log("connncetion is successful 8080");
}); */