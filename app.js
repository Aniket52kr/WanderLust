const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

// use dotenv only in development phase not in production:-
if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
};


// using express.router() object:
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const port = 3000;


// Initialize db and connect:-----------
let MONGO_URL = process.env.MONGODB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};



// set view engine:---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended : true}));           //to parse all the request data

app.use(methodOverride("_method"));           //to use a method-override package



// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);


// use a static file:
app.use(express.static(path.join(__dirname, "/public")));


// connect-mongo for session store:--
const store = MongoStore.create({
    mongoUrl : MONGO_URL,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

// use express-session:-----
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


// main route:------------------
// app.get("/", (req, res) => {
//     res.send("root is working");
// });


//use express-session
app.use(session(sessionOptions));          

// use connect-flash:-------
app.use(flash());


// initialize a passport:------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));      //use localstrategy inside the passport 

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// middleware for flash Message:------
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// // demo user route:-------
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "student123" 
//     });
//     // to save the user data we use a register() method:
//     let registeredUser = await User.register(fakeUser, "student@123");
//     res.send(registeredUser);
// })


// use all listings routes from ./routes/listing.js folder using express router:-----------
app.use("/listings", listingRouter);

// use all reviews routes from ./routes/review.js folder using express router:-----------
app.use("/listings/:id/reviews", reviewRouter);

// use all reviews routes from ./routes/review.js folder using express router:-----------
app.use("/", userRouter);



// create a page not found route:-----this route check all incomming request that cannot match any route, so send a error msg
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});



// Error handler middleware:-----------------
app.use((err, req, res, next) => {
    // deconstruct your statuscode and message
    let {statusCode = 500, message = "Something went wrong!"} = err;

    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});



app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});