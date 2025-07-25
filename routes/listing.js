const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const { isLoggedin } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const { listingSchema } = require("../schema.js");




// Main Route -- to show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// new (create) route
router.get("/new", isLoggedin, (req, res) => {
    res.render("listings/new");
});


router.post("/", isLoggedin, wrapAsync(async (req, res) => {
    const { listing } = req.body;
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    if (!listing.image || listing.image.url.trim() === "" || listing.image === null) {
        delete listing.image;
    }
    const newListing = new Listing(listing);
    newListing.owner = req.user._id
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect(`/listings`);
}));


// read/show route
router.get("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));


//edit route
router.get("/:id/edit", isLoggedin,isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    req.flash("success", "Listing Edited Successfully");
    res.render("listings/edit", { listing });
}));

//update
router.put("/:id", validateListing,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currentUser._id)){
    //     req.flash("error","You don't have permission to edit");
    //     return res.redirect(`listings${id}`);
    // } convert it into middleware
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings`);
}));

//delete route
router.delete("/:id", isLoggedin,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Succesfully");
    res.redirect("/listings");
}));

module.exports = router;