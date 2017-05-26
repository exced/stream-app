var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
var config = require('../config/database');

module.exports = function (passport) {
    var opts = {};
    opts.secretOrKey = config.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.find({ id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false, { message: "Incorrect Token!!" });
            }
            if (user) {
                if (user[0].token_expiration_date <= Date.now()) {
                    return done(null, false, { message: "Expired Token" });
                } else {
                    return done(null, user);
                }
            } else {
                return done(null, false, { message: "Incorrect Token" });
            }
        })
    }));
}