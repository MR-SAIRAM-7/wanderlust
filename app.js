const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected sucessfully");
}).catch((err)=>{
    console.log(err)
});

app.get("/",(req,res) =>{
    res.send(`App is listening at port : ${port}`)
})

app.get("/test", async (req,res)=>{
    let sampleListing = new Listing({
        title:"My new Villa",
        description: "This is description",
        price:1200,
        location: "canada",
    })
    await sampleListing.save();
    console.log ("Sample was saved");
    res.send("Successful testingg");
})

app.listen(port,(req,res)=>{
    console.log(`App is listening at port : ${port}`);
})
