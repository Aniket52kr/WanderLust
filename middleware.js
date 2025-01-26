const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");



// check user is loggedin or not:------
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    // check if user are authenticated or not
    if(!req.isAuthenticated()) {
        // if usser are not loggedin the store the originalUrl, after loggedin they can redirect to originalUrl
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You are not the owner of this listing!");
        return res.redirect("/login");
    }
    next();
};



// store redirectUrl into locals:
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


// authorization for listing operations:-------
module.exports.isOwner = async (req, res, next) => { 
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


// convert listin validation schema into middleware:----(joi part gets convert into function)------
module.exports.validateListing = (req, res, next) => {

    // better way to apply validation on schema using joi tools:-----------
    let { error } = listingSchema.validate(req.body);
    console.log(error);
   
    if(error) {
        //conbine multiple error properties into one error properties,    error msg are in object form
        let errMsg = error.details.map((element) => element.message).join(",");   

        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



// convert review validation schema into middleware:----(joi part gets convert into function)------
module.exports.validateReview = (req, res, next) => {

    // better way to apply validation on schema using joi tools:-----------
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
   
    if(error) {
        //conbine multiple error properties into one error properties,    error msg are in object form
        let errMsg = error.details.map((element) => element.message).join(",");   

        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// authorization for delete reviews operations:-------
module.exports.isReviewAuthor = async (req, res, next) => { 
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this Review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};