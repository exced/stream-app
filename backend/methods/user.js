let User = require('../models/user'),
    config = require('../config/database'),
    sockets = require('./sockets'),
    jwt = require('jwt-simple'),
    uuid = require('uuid');

var functions = {

    login: function (req, res) {
        if ((!req.body.username) || (!req.body.password)) {
            res.status(400).json({ success: false, msg: 'Bad request' });
        }
        else {
            User.findOne({ username: req.body.username }, function (err, user) {
                if (err) {
                    console.error(err);
                };
                if (!user) {
                    res.send({ success: false, msg: JSON.stringify(user) });
                }
                else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            let token = jwt.encode(user, config.secret);
                            sockets.add(req.body.username, uuid.v4());
                            res.status(200).json({ success: true, token: token });
                        } else {
                            return res.status(403).send({ success: false, msg: 'Authenticaton failed, wrong password.' });
                        }
                    })
                }
            })
        }
    },

    signin: function (req, res) {
        if ((!req.body.username) || (!req.body.password)) {
            res.status(400).json({ success: false, msg: 'Bad request' });
        }
        else {
            /* not authenticated */
            let newUser = User({
                username: req.body.username,
                password: req.body.password,
            });
            /* save */
            newUser.save(function (err, newUser) {
                if (err) {
                    console.error(err);
                }
                if (err) {
                    res.json({ success: false, msg: 'Failed to save' })
                }
                else {
                    let token = jwt.encode(newUser, config.secret);
                    sockets.add(req.body.username, uuid.v4());
                    res.status(200).json({ success: true, token: token });
                }
            })
        }
    },

}

module.exports = functions;