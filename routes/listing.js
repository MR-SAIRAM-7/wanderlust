// routes/listings.js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");

// show all listings
router.get("/", listingController.index);

// show form to create new listing
router.get("/new", isLoggedin, listingController.renderNewForm);

// create new listing
router.post("/", isLoggedin, listingController.createListing);

// show single listing by ID
router.get("/:id", listingController.showListing);

// show edit form
router.get("/:id/edit", isLoggedin, isOwner, listingController.renderEditForm);

// spdate listing
router.put("/:id", isLoggedin, isOwner, validateListing, listingController.updateListing);

// delete listing
router.delete("/:id", isLoggedin, isOwner, listingController.deleteListing);

module.exports = router;