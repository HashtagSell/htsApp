// load all the things we need
var LocalStrategy  = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// load up the user model
var User = require('../database/models/user.js');


var common   = require('../common.js');
var configAuth  = common.config();

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, 'The email you entered does not belong to any account.'); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, 'Oops! Wrong password.'); // create the loginMessage and save it to session as flashdata

                if (!user.stats.activated)
                    return done(null, false, 'Please acknowledge the activation email (check your spam too!).');

                // all is well, return successful user
                return done(null, user);
            });

        }
    ));






    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback: true

    }, function(req, token, refreshToken, profile, done) { // facebook will send back the token and profile

        // asynchronous
        process.nextTick(function () {

            console.log("profile", profile);
            console.log("refreshToken", refreshToken);
            console.log("token", token);

            // find the user in the database based on their facebook id
            User.findOne({'_id': req.user._id}, function (err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in (SAVE Facebook JSON if not done already!)
                if (user) {
                    // set all of the facebook information in our user model
                    user.user_settings.linkedAccounts.facebook.id = profile.id; // set the users facebook id
                    user.user_settings.linkedAccounts.facebook.token = token; // we will save the token that facebook provides to the user
                    user.user_settings.linkedAccounts.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    user.user_settings.linkedAccounts.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    user.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the updated user
                        return done(null, user);
                    });

                }

            });
        });

    }));




    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

            consumerKey     : configAuth.twitterAuth.consumerKey,
            consumerSecret  : configAuth.twitterAuth.consumerSecret,
            callbackURL     : configAuth.twitterAuth.callbackURL,
            passReqToCallback: true

        },
        function(req, token, tokenSecret, profile, done) {

            console.log('token', token);
            console.log('tokenSecret', tokenSecret);
            console.log('profile', profile);


            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {

                console.log("ADD TWITTER CREDS TO LOGGED IN USER");

                // find the user in the database based on their facebook id
                User.findOne({'_id': req.user._id}, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in (SAVE Facebook JSON if not done already!)
                    if (user) {
                        // set all of the facebook information in our user model
                        user.user_settings.linkedAccounts.twitter.id = profile.id; // set the users facebook id
                        user.user_settings.linkedAccounts.twitter.token = token; // we will save the token that facebook provides to the user
                        user.user_settings.linkedAccounts.twitter.tokenSecret = tokenSecret; // we will save the token that facebook provides to the user
                        user.user_settings.linkedAccounts.twitter.username = profile.username;
                        user.user_settings.linkedAccounts.twitter.displayName = profile.displayName;

                        // save our user to the database
                        user.save(function (err) {
                            if (err)
                                throw err;

                            // if successful, return the updated user
                            return done(null, user);
                        });
                    }
                });

            });

        }));
};