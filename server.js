var express  = require('express');
var app      = express();
var port     = (process.env.PORT || 8081);
var websocketPort = (process.env.WEBSOCKET_PORT || 8082);

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var compress = require('compression');

var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var multer       = require('multer');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);

var common   = require('./config/common.js');
var env  = common.config();

//Enable Gzip
app.use(compress());

// Connect to Mongo db =====================================
mongoose.connect(env.mongo.url); // connect to our database


//Passport.js config
require('./config/passport/passport.js')(passport); // passport for configuration


//Uses prerender.io service to generate html pages for search engines and crawlers.  Proxy requests to APIs from client.
if(process.env.NODE_ENV === "DEVELOPMENT") { //Run the local prerender server
    app.use(require('prerender-node').set('prerenderServiceUrl', env.prerender_io.url).set('prerenderToken', env.prerender_io.token));

    var postingAPI = 'http://localhost:4043',
        notificationAPI = 'http://localhost:4444',
        realtimeAPI = 'ws://localhost:4044',
        freeGeoIp = 'http://localhost:8080';

} else if(process.env.NODE_ENV === "STAGING") { //use prerender.io service
    app.use(require('prerender-node').set('prerenderToken', env.prerender_io.token));


    var postingAPI = 'http://ec2-52-26-231-204.us-west-2.compute.amazonaws.com:8882',
        notificationAPI = 'http://ec2-52-26-231-204.us-west-2.compute.amazonaws.com:8884',
        realtimeAPI = 'http://ec2-52-26-231-204.us-west-2.compute.amazonaws.com:8881',
        freeGeoIp = 'http://ec2-52-26-231-204.us-west-2.compute.amazonaws.com:8081';


} else if(process.env.NODE_ENV === "PRODUCTION") { //use prerender.io service
    app.use(require('prerender-node').set('prerenderToken', env.prerender_io.token));

    var postingAPI = 'http://ec2-52-10-26-55.us-west-2.compute.amazonaws.com:8882',
        notificationAPI = 'http://ec2-52-10-26-55.us-west-2.compute.amazonaws.com:8884',
        realtimeAPI = 'http://ec2-52-10-26-55.us-west-2.compute.amazonaws.com:8881',
        freeGeoIp = 'http://ec2-52-10-26-55.us-west-2.compute.amazonaws.com:8081';
}



app.all("/v1/postings*", function(req, res) {
    console.log('redirecting to posting api', postingAPI);
    apiProxy.web(req, res, {target: postingAPI});
});

app.all("/v1/users*", function(req, res) {
    console.log('redirecting to posting api user endpoint', postingAPI);
    apiProxy.web(req, res, {target: postingAPI});
});

app.all("/v1/groupings*", function(req, res) {
    console.log('redirecting to posting api groupings endpoint', postingAPI);
    apiProxy.web(req, res, {target: postingAPI});
});

app.all("/v1/publishers*", function(req, res) {
    console.log('redirecting to posting api publishing endpoint', postingAPI);
    apiProxy.web(req, res, {target: postingAPI});
});

app.all("/v1/annotations*", function(req, res) {
    console.log('redirecting to posting api annotations endpoint', postingAPI);
    apiProxy.web(req, res, {target: postingAPI});
});

app.all("/v1/transactions*", function(req, res) {
    console.log('redirecting to posting api transactions endpoint', postingAPI);
    apiProxy.web(req, res, {target: postingAPI});
});

app.all("/v1/reviews*", function(req, res) {
    console.log('redirecting to posting api reviews endpoint', postingAPI);
    apiProxy.web(req, res, {target: postingAPI});
});

app.all("/v1/queues*", function(req, res) {
    console.log('redirecting to notification api queues endpoint', notificationAPI);
    apiProxy.web(req, res, {target: notificationAPI});
});


app.all("/json*", function(req, res) {
    console.log('redirecting to freeGeoIp endpoint', freeGeoIp);
    apiProxy.web(req, res, {target: freeGeoIp});
});

//Socket.io proxy server on 8082
httpProxy.createServer({
    target: realtimeAPI,
    ws: true
}).listen(websocketPort);


//force HTTPS if request is coming from production or staging
app.use(function(req, res, next) {
    var host = req.get('host');

    if(host === "hashtagsell.com" || host === "www.hashtagsell.com" ) {

        host = "www.hashtagsell.com";  //Force url to always contain www

        if ((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) { //If not https
            res.redirect('https://' + host + req.url); //force https
        } else {
            next();
        }
    } else if(host === "staging.hashtagsell.com" || host === "http://staging.hashtagsell.com" || host === "staging.hashtagsell.com/" || host === "http://staging.hashtagsell.com/") {

        if ((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) { //If not https
            res.redirect('https://' + host + req.url); //force https
        } else {
            next();
        }
    } else if(host === "production.hashtagsell.com" || host === "http://production.hashtagsell.com" || host === "production.hashtagsell.com/" || host === "http://production.hashtagsell.com/") {

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


if(process.env.NODE_ENV === "DEVELOPMENT") {
    app.use(express.static(__dirname + '/app/dist/dev'));
} else if(process.env.NODE_ENV === "STAGING") {
    app.use(express.static(__dirname + '/app/dist/stage'));
} else if(process.env.NODE_ENV === "PRODUCTION") {
    app.use(express.static(__dirname + '/app/dist/prod'));
}

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


//Required for image uploads.
app.use(multer({ dest: './uploads/'}));


//Passport session details
app.use(session({
    secret: env.passportjs.secret,
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


// start Node server ===========================================================
app.listen(port);
console.log('HashtagSell | ' + process.env.NODE_ENV + ' ENV | PORT: ' + port);