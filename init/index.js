// Initailize database:-------
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config({path: "../.env"});

// Create connection with DB:------------------
const MONGO_URL = process.env.MONGODB_URL;

if (!MONGO_URL) {
  console.log("Error: MONGODB_URL is not defined in .env file");
  process.exit(1); // Exit if connection string is missing
}

main()
  .then(() => {
    console.log("Connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });

async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000, // Set a timeout for the connection
    });
  } catch (err) {
    console.error("Error during database connection:", err);
    throw err; // Propagate the error if connection fails
  }
}

const initDB = async () => {
  try {
    // Clear previous data
    await Listing.deleteMany({});
    console.log("Previous listings deleted");

    // Insert new data
    // initData.data = initData.data.map((obj) => ({...obj, owner: "67967aef46a3eb4ac7b29dd0"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing the database:", err);
  }
};
