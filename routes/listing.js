const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
//const ExpressError = require("../utils/ExpressError.js");
//const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js")

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
//const upload = multer({ dest: 'uploads/' });
const upload = multer({storage});

//console.log(isLoggedIn);
/* const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);//used Joi 
     
     if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); 
     }else{
        next();
     }     
};
 */

//Index Route
 /* router.get("/" , wrapAsync(async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs" , {allListings});
}));  */

router.get("/" , wrapAsync(listingController.index));


//New Route
/* router.get("/new" , isLoggedIn , (req,res)=>{
    res.render("listings/new.ejs");
}); */

router.get("/new" , isLoggedIn,listingController.renderNewForm)

//Show Route
/* router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");
    //console.log(listing);
    if(!listing){
    req.flash("error" , "listing you requested does not exist !"); 
    return res.redirect("/listings");
   }
    res.render("listings/show.ejs" , {listing});
})); */

router.get("/:id",wrapAsync(listingController.showListing));



//create Route
/* router.post("/" , isLoggedIn ,validateListing, wrapAsync(async(req,res,next)=>{
    const listingData = req.body.listing;
    listingData.owner = req.user._id;
    const newListing = new Listing(listingData);
      //  const newListing = new Listing(req.body.listing);
       newListing.owner = req.user._id; 
       //console.log(newListing);
       //console.log(req.user);
       await newListing.save();
       req.flash("success" , "New Listing Created!");
       res.redirect("/listings");
})); */

router.post("/" , isLoggedIn , validateListing, upload.single('listing[image]'),wrapAsync(listingController.createListing));
/* router.post("/" , upload.single('listing[image]'),  (req,res)=>{
    res.send(req.file);
}); */

//Edit Route 
/* router.get("/:id/edit",  isLoggedIn ,isOwner,wrapAsync(async (req ,res) => {
      let {id} = req.params;
    const listing = await Listing.findById(id).populate("owner");
     if(!listing){
    req.flash("error" , "listing you requested does not exist !"); 
    return res.redirect("/listings");
   }
    res.render("listings/edit.ejs" , {listing});
})); */

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update Route
/* router.put("/:id" ,  isLoggedIn , isOwner,validateListing , wrapAsync(async(req,res)=> {
      let {id} = req.params;
      await Listing.findByIdAndUpdate(id , {...req.body.listing});
      req.flash("success" , "Listing Updated!");
      res.redirect(`/listings/${id}`);
})); */

router.put("/:id" ,  isLoggedIn , isOwner,upload.single('listing[image]'),validateListing , wrapAsync(listingController.updateListing));

//Delete Route
/* router.delete("/:id" , isLoggedIn ,isOwner, wrapAsync(async (req , res)=>{
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     //console.log(deletedListing);
     req.flash("success" , "Listing Deleted!");
     res.redirect("/listings" );
})); */

router.delete("/:id" , isLoggedIn ,isOwner, wrapAsync(listingController.destroyListing));
module.exports = router;