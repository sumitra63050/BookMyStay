const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async(req,res)=>{
   const { q, category } = req.query;
   let query = {};
   
   if (q) {
       query.$or = [
           { title: { $regex: q, $options: "i" } },
           { location: { $regex: q, $options: "i" } },
           { country: { $regex: q, $options: "i" } }
       ];
   }
   
   if (category) {
       query.category = category;
   }
   
   const allListings = await Listing.find(query);
   res.render("listings/index.ejs" , {allListings, q, category});
}

module.exports.renderNewForm = ((req,res)=>{
    res.render("listings/new.ejs");
});

module.exports.showListing   = (async(req,res)=>{
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
});

/* module.exports.createListing = (async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = {url,filename};
       await newListing.save();
       req.flash("success" , "New Listing Created!");
       res.redirect("/listings");
}); */

module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);

    // 🔹 IMAGES (Multiple)
    if (req.files) {
      newListing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    }

    // 🔹 OWNER
    newListing.owner = req.user._id;

    // 🔹 LOCATION → GEOCODING (IMPORTANT)
    const location = req.body.listing.location;

    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "BookMyStay (student project)"
        }
      }
    );

    if (geoResponse.data.length === 0) {
      req.flash("error", "Invalid location");
      return res.redirect("/listings/new");
    }

    const lat = geoResponse.data[0].lat;
    const lng = geoResponse.data[0].lon;
     console.log(lat,lng);
    // 🔹 SAVE geometry in DB
    newListing.geometry = {
      type: "Point",
      coordinates: [lng, lat]   // long first, lat second
    };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    next(err);
  }
};


module.exports.renderEditForm = (async (req ,res) => {
      let {id} = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if(!listing){
    req.flash("error" , "listing you requested does not exist !"); 
    return res.redirect("/listings");
   }
   let originalImageUrl = listing.images.length > 0 ? listing.images[0].url : "";
   if (originalImageUrl) {
       originalImageUrl = originalImageUrl.replace("/upload" , "upload/h_300,w_250");
   }
    res.render("listings/edit.ejs" , {listing,originalImageUrl});
});

module.exports.updateListing  = (async(req,res)=> {
      let {id} = req.params;
      let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

      if(req.files && req.files.length > 0){
          listing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
          await listing.save();
      }
      req.flash("success" , "Listing Updated!");
      res.redirect(`/listings/${id}`);
});

module.exports.destroyListing = (async (req , res)=>{
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     //console.log(deletedListing);
     req.flash("success" , "Listing Deleted!");
     res.redirect("/listings" );
});