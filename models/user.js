const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    // username and password added by passportLocalMongoose by default along with a hash and salt
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);