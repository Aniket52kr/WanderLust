const User = require("../models/user");


// user signup route:-----
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});

        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        // after signup user can automatically login
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });

    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");

    }
};



// user login route:-----
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success","Welcome back to WanderLust!");

    // check the "res.locals.redirectUrl" is empty then redirect into /listings 
    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
};



// user logout route:-------
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {  
        if(err) {
            return next(err);
        }
        req.flash("success", "You are successfully Logged out now!");
        res.redirect("/listings");
    });
};