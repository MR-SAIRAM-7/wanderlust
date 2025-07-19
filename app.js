const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,"/public")));


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
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

// new (create) route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs")
})

app.post("/listings", async (req, res) => {
    // let { title, description, image, price, country, location } = req.body;
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");

})

// read/show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
});


//edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
})

//update
app.put("/listings/:id" , async (req,res)=>{
     let { id } = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     res.redirect(`/listings`);
})

//delete route
app.delete("/listings/:id", async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})


