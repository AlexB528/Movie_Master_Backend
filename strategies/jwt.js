const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SECRET_KEY'; //normally store this in process.env.secret

const userDetails = await User.find({ username: username }).exec();

module.exports = new JwtStrategy(opts, async (jwt_payload, done) => {
    user = await User.find({ username: jwt_payload.username }).exec();
    if (user) {
        return done(null, true)
    }
    return done(null, false)
})