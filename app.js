const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");
const reviewSchema = require("./schema.js");
const Review = require("./models/review.js");
const { wrap } = require("module");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, "/public")));


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Connected database sucessfully");
}).catch((err) => {
    console.log(err)
});

app.get("/", (req, res) => {
    res.send(`App is listening at port : ${port}`)
})

const validateListing = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
}


// app.get("/test", async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description: "Thi is my new Villa in Goa!!",
//         price:1200,
//         location: "Calangute, Goa",
//         country: "India",
//     })
//     await sampleListing.save();
//     console.log ("Sample was saved");
//     res.send("Successful testingg");
// })

app.listen(port, (req, res) => {
    console.log(`App is listening at port : ${port}`);
});


// index route

app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// new (create) route

app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});



//main route

app.post("/listings", wrapAsync(async (req, res) => {
    const { listing } = req.body;
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    if (!listing.image || listing.image.url.trim() === "" || listing.image === null) {
        delete listing.image;
    }
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
}));


// read/show route
app.get("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing });
}));


//edit route
app.get("/listings/:id/edit", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//update
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// POST route for creating reviews
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

// DELETE route for reviews
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    
    // remove review reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // delete the actual review document
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
}));


// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not Found"));
// })

// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "something went wrong" } = err;
//     res.status(statusCode).send(message);
// })


// Catch-all for any unmatched routes
app.all('/{*any}', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});



// General error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("./listings/error.ejs", { err });
});

