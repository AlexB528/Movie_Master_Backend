// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'SECRET_KEY'; //normally store this in process.env.secret

// module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
    
//     if (jwt_payload.username === "BRover11") {
//         return done(null, true)
//     }
//     return done(null, false)
// })

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SECRET_KEY'; //normally store this in process.env.secret
const User = require("../models/user");

module.exports = new JwtStrategy(opts, async (jwt_payload, done) => {
    const user = await User.findOne({ username: jwt_payload.username }).exec();
    if (user) {
        return done(null, true)
    }
    return done(null, false)
}) 