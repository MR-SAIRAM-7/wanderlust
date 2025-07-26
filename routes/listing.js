// routes/listings.js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");

const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })

// show all listings
router.get("/", listingController.index);

// show form to create new listing
router.get("/new", isLoggedin, listingController.renderNewForm);

// create new listing
router.post("/", isLoggedin, upload.single('listing[image]'), validateListing, listingController.createListing);

// show single listing by ID
router.get("/:id", listingController.showListing);

// show edit form
router.get("/:id/edit", isLoggedin, isOwner, listingController.renderEditForm);

// update listing
router.put("/:id", isLoggedin, isOwner, upload.single('listing[image]'), validateListing, listingController.updateListing);

// delete listing
router.delete("/:id", isLoggedin, isOwner, listingController.deleteListing);

module.exports = router;