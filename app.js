const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Connected sucessfully");
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

// read/show route
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    let item = await Listing.findById(id);
    res.render("./listings/show.ejs",{item})
});
