let express = require('express'),
    user = require('../methods/user');

let router = express.Router();

router.post('/login', user.login);
router.post('/signin', user.signin);

router.post('/contacts/', user.addContact);

module.exports = router;