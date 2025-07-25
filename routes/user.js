// routes/user.js

const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user");

// Signup Routes
router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));

// Login Routes
router.get("/login", userController.renderLoginForm);
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
);

// Logout Route
router.post("/logout", userController.logout);

module.exports = router;
