// define all routes that are related to listings part using express.router() object:------
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner , validateListing} = require("../middleware.js")

const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })



// combine "/" route:------
router.route("/")
.get( wrapAsync(listingController.index))         //index route

.post( 
    isLoggedIn,                                 //create route
    upload.single("listing[image]"), 
    validateListing  , 
    wrapAsync(listingController.createListing)
);   


// New Route:---------------
router.get("/new", isLoggedIn ,listingController.renderNewForm);


// combine "/:id" route:-------
router.route("/:id")
.get( wrapAsync(listingController.showListing))        //show route

.put( 
    isLoggedIn,                                     //update route
    isOwner, 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
)   

.delete( 
    isLoggedIn,                                   //delete route
    isOwner,
    wrapAsync(listingController.destroyListing)
);   




// Edit Route:--------------------
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm)
); 


module.exports = router;