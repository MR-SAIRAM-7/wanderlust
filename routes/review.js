// routes/reviews.js
const express = require("express");
const router = express.Router({ mergeParams: true }); // to access :id from parent route
const wrapAsync = require("../utils/wrapAsync.js");

const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// CREATE review
router.post(
    "/",
    isLoggedin,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// DELETE review
router.delete(
    "/:reviewId",
    isLoggedin,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;
