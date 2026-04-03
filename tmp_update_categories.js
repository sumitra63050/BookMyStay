require('dotenv').config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = process.env.MONGO_URL;

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"];
    
    const listings = await Listing.find({});
    for (let i = 0; i < listings.length; i++) {
        listings[i].category = categories[i % categories.length];
        await listings[i].save();
    }

    console.log("Updated categories for existing listings");
    mongoose.connection.close();
}

main();
