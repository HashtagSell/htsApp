module.exports = function(app, passport) {


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        if(process.env.NODE_ENV === "DEVELOPMENT") {
            res.sendFile(__dirname + '/app/dist/dev/dev_index.html'); // load dev index.html which kicks off angular
        } else if(process.env.NODE_ENV === "STAGING") {
            res.sendFile(__dirname + '/app/dist/stage/stage_index.html'); // load staging index.html which kicks off angular
        } else if(process.env.NODE_ENV === "PRODUCTION") {
            res.sendFile(__dirname + '/app/dist/prod/prod_index.html'); // load production index.html which kicks off angular
        }
    });



    // =====================================
    // Capture User Feedback ===============
    // =====================================
    var feedback = require('./api/feedback_api');
    app.post('/feedback', feedback.submit);



    // =====================================
    // Reverse geocode via lat long to get postal code(Used to lookup the zip code a lat long falls into.  Necessary to post to ebay!)
    // =====================================
    var geo = require('./utils/geo'); //Proxy between HTS and Google reverse geocode
    app.get('/utils/reversegeocode', geo.reverseGeocode);


    // =====================================
    // Geolocate user via IP address
    // =====================================
    app.get('/utils/geolocate', geo.geolocateIp);



    // =====================================
    // Photo Upload ======================== (Used when user uploads profile photo, banner photo, or adds an item to item they're selling)
    // =====================================
    var image_upload_api = require('./api/image_upload_api');
    app.post('/upload', isLoggedIn, function(req, res) {

        if (req.files.profilePhoto || req.files.bannerPhoto) { // based on param the user is updating profile photo
            image_upload_api.profileImage(req, res);

        } else { // user is uploading photos appended to post
            image_upload_api.postingImage(req, res);
        }
    });




    // =====================================
    // LOCAL AUTHENTICATION ================
    // =====================================
    app.post('/login', function(req, res) {
        passport.authenticate('local-login', function (err, user, msg) {
            if (err)   {
                return res.json({ error: err.message });
            }
            if (!user) {
                return res.json({error : msg});
            }
            req.login(user, {}, function(err) {
                if (err) {
                    console.log("error occurred during passport login");
                    return res.json({error : err});
                }
                return res.json({
                        "success" : true,
                        "id": req.user._id,
                        "user_settings" : req.user.user_settings || {},
                        "facebook" : req.user.facebook || {},
                        "twitter" : req.user.twitter || {},
                        "ebay" : req.user.ebay || {},
                        "amazon" : req.user.amazon || {}
                    });
            });
        })(req, res);
    });

    //Local auth user log out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //Local auth user signup
    var activate = require('./api/activate_acct.js');
    app.post('/signup', activate.signup);

    //Local auth email activation url
    app.get('/activate', activate.id);

    //Local auth fogot password
    app.post('/forgot', activate.forgotPassword);

    //Local auth reset password
    app.post('/reset', activate.reset);

    //early access subscriber
    app.post('/subscribe', activate.subscribe);



    // =====================================
    // PRECACHING ================
    // =====================================
    var precache = require('./api/precache_api.js');
    app.post('/precache', function(req, res){
        precache.recache(req,res);
    });




    // =====================================
    // FACEBOOK AUTH ROUTES ================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', function(res, req, next){
        passport.authenticate('facebook', { scope : ['email', 'publish_actions']}, function(res, req, next){

        })(res, req, next);

    });

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/settings/account',
            failureRedirect : '/settings/account'
        })
    );

    var facebook = require('./api/facebook_api');
    app.delete('/auth/facebook', function(req, res) {
        facebook.disconnectAccount(req, res);
    });




    // =====================================
    // TWITTER AUTH ROUTES =================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', function(res, req, next){

        passport.authenticate('twitter', function(res, req, next){

        })(res, req, next);

    });

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/settings/account',
            failureRedirect : '/settings/account'
        })
    );

    var twitterApi = require('./api/twitter_api');
    app.delete('/auth/twitter', function(req, res) {
        twitterApi.disconnectAccount(req, res);
    });



    app.post('/publishTweet', function(req, res) {
        twitterApi.publishToTwitter(req, res);
    });




    // =====================================
    // EBAY AUTH ROUTES ====================
    // =====================================
    // route for twitter authentication and login
    var ebay = require('./api/ebay_api');
    app.get('/auth/ebay/sessionId', function(req, res){
        ebay.getSessionId(req, res);
    });

    app.get('/auth/ebay/fetchToken', function(req, res){
        ebay.fetchToken(req, res);
    });

    app.delete('/auth/ebay', function(req, res) {
        ebay.disconnectAccount(req, res);
    });


    app.get('/ebayauth', function(req, res){
        res.send("Please wait as we redirect you to eBay sign-in page...");
    });




    // =====================================
    // BRAINTREE PAYMENT ROUTES ============
    // =====================================
    var payment = require('./api/braintree_api.js');
    app.get("/payments/client_token", function (req, res) {
        payment.getClientToken(req, res);
    });

    app.post("/payments/purchase", function (req, res) {
        payment.sendPayment(req, res);
    });

    app.post("/payments/submerchant", function (req, res) {
        payment.createSubMerchant(req, res);
    });


    // =====================================
    // BRAINTREE WEBHOOKS ============
    // =====================================
    var btWebHook = require('./api/braintree_webhooks_api.js');
    app.get("/btwebhook", function (req, res) {
        btWebHook.verify(req, res);
    });

    app.post("/btwebhook", function (req, res) {
        btWebHook.digest(req, res);
    });

    // =====================================
    // EMAIL OFFER NOTIFICATIONS ===========
    // =====================================
    var transaction_notifications_api = require('./api/transaction_notification_api.js');

    app.post("/email/meeting-accepted/instant-reminder", function(req, res) {
        transaction_notifications_api.meetingAccepted.instantReminder(req, res);
    });

    app.post("/email/meeting-proposed/instant-reminder", function(req, res) {
        transaction_notifications_api.meetingProposed.instantReminder(req, res);
    });

    app.post("/email/meeting-updated/instant-reminder", function(req, res) {
        transaction_notifications_api.meetingUpdated.instantReminder(req, res);
    });

    app.post("/email/question-asked/instant-reminder", function(req, res) {
        transaction_notifications_api.questionAsked.instantReminder(req, res);
    });




    // =====================================
    // USER API ============================
    // =====================================


    //Get all public data associated with username
    app.get('/getprofile', function(req, res){
        activate.getProfile(req, res);
    });

    //Push updated user data to server (favorites, items for sale, labels, user settings, etc).
    var user_settings_api = require('./api/user_settings_api.js');
    app.post('/updateUserSettings', isLoggedIn, user_settings_api.push);

    //Get all the user's user_settings
    app.get('/getUserSettings', isLoggedIn, user_settings_api.getUserSettings);


    app.delete('/user', isLoggedIn, user_settings_api.deleteAccount);

    //Admin accounts can lookup entire user details.
    app.get('/users/:username', isAdmin, function(req, res){
        user_settings_api.adminLookupAccount(req, res);
    });

    // =====================================
    // PRIVATE BETA ADMIN ACCESS
    // =====================================

    //Generate group key that can be used an infinite amount of times.
    //http://domain.com/generatekeys?type=group&key=_your_key_here

    //Generate unique keys that can only be used once.
    //http://domain.com/generatekeys?type=individual&quantity=5

    var admin = require('./api/admin/admin.js');
    app.get('/generatekeys', isAdmin, admin.generateKeys);



    //Since using HTML5 mode in htsApp.js we need to preface all requests so that they are directed to index.ejs.. this way we use the client-side angular router.
    app.use(function(req, res) {
        if(process.env.NODE_ENV === "DEVELOPMENT") {
            res.sendFile(__dirname + '/app/dist/dev/dev_index.html'); // load dev index.html which kicks off angular
        } else if(process.env.NODE_ENV === "STAGING") {
            res.sendFile(__dirname + '/app/dist/stage/stage_index.html'); // load staging index.html which kicks off angular
        } else if(process.env.NODE_ENV === "PRODUCTION") {
            res.sendFile(__dirname + '/app/dist/prod/prod_index.html'); // load production index.html which kicks off angular
        }
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


// route middleware to make sure a user is logged in
function isAdmin(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        var role = req.user.local.role;
        if(role == "admin") {
            return next();
        }
    // if they aren't redirect them to the home page
    res.redirect('/');
}