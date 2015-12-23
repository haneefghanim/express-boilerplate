// Initialize node environment
// Defaulting to development, must explicitly choose production.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Dependencies
var config = require('config'),
    express = require('express'),
    logfmt = require('logfmt'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    session = require('express-session'),
    redisStore = require('connect-redis')(session),
    http = require('http'),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    errors = require('./lib/errors.js'),
    models = require('./models');

// Initialize app + middleware
var app = express();
app.use(logfmt.requestLogger());
app.use(bodyParser.json());                         // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(multer({ // For parsing multipart/form-data
    dest: '/tmp/',
    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
    }
}));
app.use(session({
    name: 'yourapp.sid',
    secret: config.get('sessionSecret'),
    resave: false,
    saveUninitialized: false,
    store: new redisStore(config.get('redis')),
    cookie: {
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years
    }
}));
app.use(cors({credentials: true, origin: true})); // For cross-domain stuff
app.use(cookieParser());

var hbs = exphbs.create({
    defaultLayout: 'app'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.enable('view cache');

// Mount API & UI routers
app.use('/api/v1', require('./routers/api.js'));
app.use('/oauth', require('./routers/oauth.js'));
app.use('/', require('./routers/ui.js'));

// Sync things that can be synced - i.e new tables.
// Need to create migrations for schema changes.
models.sequelize.sync().then(function() {

    // Spin up the server
    app.listen(config.get('port'), function() {
        console.log('Your app listening on port: ' + config.get('port'));
    });
});