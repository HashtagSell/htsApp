var express  = require('express');
var app      = express();
var port     = (process.env.PORT || 8081);
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var multer       = require('multer');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);

// configuration ===============================================================
var configDB = require('./config/database/mongo.js');
mongoose.connect(configDB.url); // connect to our database
require('./config/passport/passport.js')(passport); // passport for configuration


//Uses prerender.io service to generate html pages for search engines and crawlers.
if(process.env.NODE_ENV === "DEVELOPMENT") { //Run the local prerender server
    app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:3000/').set('prerenderToken', 'kUoQBvD9vHaR9piPE0fq'));
} else if (process.env.NODE_ENV === "PRODUCTION") { //use prerender.io service
    app.use(require('prerender-node').set('prerenderToken', 'kUoQBvD9vHaR9piPE0fq'));
}


//force HTTPS if request is coming from production
app.use(function(req, res, next) {
    var host = req.get('host');

    if(host === "hashtagsell.com" || host === "www.hashtagsell.com") {

        host = "www.hashtagsell.com";  //Force url to always contain www

        if ((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) { //If not https
            res.redirect('https://' + host + req.url); //force https
        } else {
            next();
        }
    } else {
        next();
    }
});


//Maps request to static folders
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/app'));


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));

//Ensure json responses are pretty formatted
app.set('json spaces', 2);

app.use(multer({ dest: './uploads/'}));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'slothloveschunk',
    saveUninitialized: true,
    resave: true,
    cookie : { maxAge: 3600000 * 24 * 30 * 2 },
    store: new MongoStore({
        mongoose_connection : mongoose.connections[0]
    })
})); // session secret cool

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen(port);
console.log('HashtagSell | '+process.env.NODE_ENV+' ENV | PORT: ' + port);