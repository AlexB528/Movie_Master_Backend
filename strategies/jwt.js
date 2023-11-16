// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'SECRET_KEY'; //normally store this in process.env.secret

// module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
//     if (jwt_payload.username === "TBrown88") {
//         return done(null, true)
//     }
//     return done(null, false)
// })
const User = require("../models/user");
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SECRET_KEY';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

module.exports = new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.username}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
})