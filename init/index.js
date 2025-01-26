// Initailize database:-------
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Create connection with DB:------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // initData.data = initData.data.map((obj) => ({...obj, owner: "678b9a6dcd14da0239924ead"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();