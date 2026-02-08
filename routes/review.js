const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
//const {listingSchema} = require("../schema.js");
//const {reviewSchema} = require("../schema.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")

/* const validateReview = (req , res , next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else {
      next();
    }
}; */

//For Reviews
//post reviews
/* router.post("/", isLoggedIn,validateReview, wrapAsync(async(req,res)=>{
           let listing = await Listing.findById(req.params.id);
           //console.log(listing);
           let newReview = new Review(req.body.review);
           newReview.author = req.user._id;

           //console.log(newReview);
          await newReview.save();
           listing.reviews.push(newReview);

           await listing.save();
           req.flash("success" , "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
}));
 */

router.post("/" , isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


//Delete Review Route
/*  */
/* router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor, wrapAsync(async(req , res)=> {
       let { id , reviewId} = req.params;
       await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}}); //reviews ko listing se bhi delete karne ke liye
       await Review.findByIdAndDelete(reviewId);
       req.flash("success" , " review was deleted !");

       res.redirect(`/listings/${id}`);
})); */

router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;