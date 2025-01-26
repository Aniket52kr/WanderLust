const Listing = require("../models/listing");
const axios = require("axios");

// listing index route:
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

// listing new route:
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

// listing show route:
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    res.render("./listings/show.ejs", { listing });
};

// listing create route:
module.exports.createListing = async (req, res, next) => {
    // Extract URL and filename from Cloudinary storage:
    let url = req.file.path;
    let filename = req.file.filename;

    const { location, country } = req.body.listing;

    // Fetch coordinates using Positionstack API
    const address = `${location}, ${country}`;
    let coordinates = { lat: null, lng: null };

    try {
        const response = await axios.get("https://api.positionstack.com/v1/forward", {
            params: {
                access_key: process.env.MAP_TOKEN, // Use environment variable for the API key
                query: address,
                limit: 1
            }
        });

        if (response.data && response.data.data.length > 0) {
            const locationData = response.data.data[0];
            coordinates.lat = locationData.latitude;
            coordinates.lng = locationData.longitude;
        } else {
            console.error("Location not found in Positionstack response.");
        }
    } catch (error) {
        console.error("Error fetching location from Positionstack:", error);
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.latitude = coordinates.lat;
    newListing.longitude = coordinates.lng;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// listing edit route:
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    // Decrease the original image height and width using Cloudinary image transformation API:
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_300");

    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

// listing update route:
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Extract URL and filename from Cloudinary storage:
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    // Fetch new coordinates if location or country changed:
    if (req.body.listing.location || req.body.listing.country) {
        const { location, country } = req.body.listing;
        const address = `${location}, ${country}`;
        let coordinates = { lat: null, lng: null };

        try {
            const response = await axios.get("https://api.positionstack.com/v1/forward", {
                params: {
                    access_key: process.env.MAP_TOKEN, // Use environment variable for the API key
                    query: address,
                    limit: 1
                }
            });

            if (response.data && response.data.data.length > 0) {
                const locationData = response.data.data[0];
                coordinates.lat = locationData.latitude;
                coordinates.lng = locationData.longitude;
            } else {
                console.error("Location not found in Positionstack response.");
            }
        } catch (error) {
            console.error("Error fetching location from Positionstack:", error);
        }

        listing.latitude = coordinates.lat;
        listing.longitude = coordinates.lng;
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// listing delete route:
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
