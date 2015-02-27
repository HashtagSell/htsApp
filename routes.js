module.exports = function(app, passport) {

    // =====================================
    // ========= SEARCH PROXY ==============
    // =====================================
    var search = require('./api/search_api'); //Proxy between HTS and 3TAPS
    app.get('/search', search.vendor);



    // =====================================
    // ========= SEARCH PROXY (RETIRE SOON) USED WHEN USER CREATES NEW POST ==============
    // =====================================
    var search_old = require('./api/search_api_old'); //Proxy between HTS and 3TAPS
    app.get('/search_old', search_old.vendor);



    // =====================================
    // ========= USER FEED ==============
    // =====================================
    var feed = require('./api/feed_api'); //Proxy between HTS and 3TAPS Polling
    app.get('/userfeed', feed.poll);



    // =====================================
    // Locations Lookup ====================
    // =====================================
    var reference = require('./api/reference_api'); //Lookup 3taps formatted metro codes
    app.get('/search/locations', reference.locationMetadata);



    // =====================================
    // Categories Metadata Lookup ==========
    // =====================================
    app.get('/search/categories', reference.categoryMetadata);



    // =====================================
    // Get list of all possible categories =
    // =====================================
    app.get('/search/categorylookup', reference.getAllCategories);



    // =====================================
    // CRON Update categories cache ========
    // =====================================
    var cron = require('./api/admin/cronJobs'); //Lookup 3taps formatted metro codes
    app.get('/cronjob/categories', isAdmin, cron.updateCategories);



    // =====================================
    // CRON Locations ======================
    // =====================================
    app.get('/cronjob/locations', isAdmin, cron.updateLocations);



    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs', { // load the index.ejs file

        });
    });




    // =====================================
    // Photo Upload ======================
    // =====================================
    var posting_api = require('./api/posting_api');
    app.post('/upload', isLoggedIn, function(req, res) {

        if (req.files.profilePhoto || req.files.bannerPhoto) { // based on param the user is updating profile photo
            user_settings_api.updateUserPhotos(req, res);

        } else { // user is uploading photos appended to post
            posting_api.upload(req, res);
        }
    });




    // =====================================
    // LOGIN ===============================
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
                return res.json(
                    {
                        success: true,
                        user_settings: req.user.user_settings
                    })
            });
        })(req, res);
    });




    // =====================================
    // SIGN UP =============================
    // =====================================
    var activate = require('./api/activate_acct.js');
    app.post('/signup', activate.signup);



    // =====================================
    //  Account Activation =================
    // =====================================
    app.get('/activate', activate.id);



    // =====================================
    // FORGOT PASSWORD =====================
    // =====================================
    app.post('/forgot', activate.forgotPassword);



    // =====================================
    // RESETS PASSWORD =====================
    // =====================================
    app.post('/reset', activate.reset);



    // =====================================
    // Early Access Subscribe ==============
    // =====================================
    app.post('/subscribe', activate.subscribe);




    // =====================================
    // FACEBOOK AUTH ROUTES ================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        })
    );




    // =====================================
    // Get User Profile ====================
    // =====================================
    app.get('/getprofile', activate.getProfile);



    // =====================================
    // Keep user_settings in sync with server
    // =====================================
    var user_settings_api = require('./api/user_settings_api.js');
    app.post('/updateUserSettings', isLoggedIn, user_settings_api.push);




    // =====================================
    // Generate private beta access keys
    // =====================================
    var admin = require('./api/admin/admin.js');
    app.get('/generatekeys', isAdmin, admin.generateKeys);


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // =====================================
    // 404 Redirect ========================
    // =====================================
    app.use(function(req, res, next){
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            res.render('404.ejs', {
                url: req.url
            });
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('"We can know only that we know nothing. And that is the highest degree of human wisdom."');
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

    console.log("checking if admin");
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        var role = req.user.local.role;
        if(role == "admin") {
            return next();
        }
    // if they aren't redirect them to the home page
    res.redirect('/');
}