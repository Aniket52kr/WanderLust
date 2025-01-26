// define a schema for the review model:-------------
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

// create a collection in db:
// module.exports = mongoose.model("Review", reviewSchema);
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;