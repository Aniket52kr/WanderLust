// define a schema for the user model:-------------
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");     

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },

});

// passportlocalmongoose automatically create a username, password, hashing and salting by default
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);