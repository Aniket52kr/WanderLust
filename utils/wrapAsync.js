// Define a custom wrapAsync error handler middleware:-----------------
function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res , next).catch(next);
    }
}

module.exports = wrapAsync;