const Review = require("../models/review");
const Listing = require("../models/listing");


// create review route:--------
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
};


// delete review route:-------
module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    // delete the review inside the listing review array:
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
    console.log("Review deleted successfully");
};