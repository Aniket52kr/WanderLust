const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// Define a schema for the listing model:
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    latitude: { 
        type: Number,
        required: false,  
    },
    longitude: { 
        type: Number,
        required: false,  
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    // build this part on your own 
    // category : {
    //     type: String,
    //     enum: ["Trending","Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic"< "Deserts"],
    // }
});

// Post mongoose middleware that deletes the listing and its associated reviews:
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

// Create a collection in the database:
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
