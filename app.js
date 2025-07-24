const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

//routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


//Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews/", reviews);


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



app.listen(port, (req, res) => {
    console.log(`App is listening at port : ${port}`);
});

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

