const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = (async(req,res)=>{
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
});

module.exports.destroyReview = (async(req , res)=> {
       let { id , reviewId} = req.params;
       await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}}); //reviews ko listing se bhi delete karne ke liye
       await Review.findByIdAndDelete(reviewId);
       req.flash("success" , " review was deleted !");

       res.redirect(`/listings/${id}`);
})