let mongoose = require('mongoose'),
    express = require('express'),
    cors = require('cors'),
    morgan = require('morgan'),
    config = require('./config/database'),
    passport = require('passport'),
    routes = require('./routes/routes'),
    bodyParser = require('body-parser'),
    app = express();

/* mongoDB connection */
mongoose.connect(config.database);

mongoose.connection.on('open', function () {
    console.log('Mongo is connected');
});

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: '30mb' }));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(routes);
/* let Express know where the passport config for user authentication is */
app.use(passport.initialize());
app.use(passport.authenticate("jwt", {
    session: true
}));
require('./config/passport')(passport);

module.exports = app;