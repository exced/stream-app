let express = require('express'),
    user = require('../methods/user');

let router = express.Router();

router.post('/login', user.login);
router.post('/signin', user.signin);

router.post('/contacts/', passport.authenticate('jwt', { session: true }), user.addContact);

module.exports = router;