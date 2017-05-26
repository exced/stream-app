var uuid = require('uuid');
module.exports = {
    database: 'mongodb://localhost/stream-app',
    secret: uuid.v4()
};
