const User = require("../models/user");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Handle sign-up on POST
exports.sign_up_post = [
    // Validate and sanitize fields.
    body("first_name")
        .trim() 
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username must be specified.")
        .isAlphanumeric()
        .withMessage("Username has non-alphanumeric characters."),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Password must be specified.")
        .isLength({ min: 8 })
        .escape()
        .withMessage("Password must be at least 8 characters long")
        .isLength({ max: 30 })
        .escape()
        .withMessage("Password cannot be more than 30 characters"),
    body("password_confirmation")
        .custom((value, { req }) => { return value === req.body.password;})
        .withMessage("Passwords don't match"),
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        console.log('am I here?')
        const errors = validationResult(req);

        try {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    return next(err);
                }
                const user = new User({
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    username: req.body.username,
                    password: hashedPassword,
                    favourites: [],
                });
                if(!errors.isEmpty()) {
                    // There are errors. Render form again with sanitized values/errors messages.
                    res.json({ message: "Unsuccessful sign up", errorDetails: errors.array()});
                    return;
                } else {
                    try {
                        const result = await user.save();
                        res.json({ message: "User successfully saved", result: result});
                    } catch (err) {
                        return next(err);
                    }
                }
            })
        } catch(err) {
            return next(err);
        };
    }),
];

//Handle log-in on POST
exports.log_in_post = async (req, res) => {
    let { username, password } = req.body;
    console.log('does this console show up on railway?');
    console.log(req.body);
    const userDetails = await User.find({ username: username }).exec();
    console.log(userDetails);
    const match = await bcrypt.compare(password, userDetails[0].password); //see if its necessary for userDetails to be an array later
    if (match) {
        const opts = {}
        opts.expiresIn = 120;  //token expires in 2min
        const secret = "SECRET_KEY" //normally stored in process.env.secret
        const token = jwt.sign({ username }, secret, opts);
        return res.status(200).json({
            message: "Auth Passed",
            token,
            userDetails
        })
    } else {
        return res.status(401).json({ message: "Auth Failed" })
    }
};

//this was just from the tutorial but I think I can delete this now
exports.protected = passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).json("YAY! this is a protected Route")
}

exports.retrieve_user_favourites = [passport.authenticate('jwt', { session: false }), async (req, res) => {
    let doc = await User.findOneAndUpdate({username: req.body.username}, {favourites: req.body.favourites});
    return res.status(200).json("YAY! this is a protected Route");

}]

exports.load_User = [passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log(req.body)
    let doc = await User.find({ username:req.body.username }).exec();
    console.log(doc)
    return res.status(200).json(doc);
}]



