// load up the analytics model
var User = require('../config/database/models/user.js');

// load up the collection that stores private launch keys
var Early_Access_Keys = require('../config/database/models/early_access_keys.js');

// load up the collection that stores early access subscribers
var Subscriber = require('../config/database/models/subscribers.js');

//Nodemail used to send email via Amazon SES
var mailer = require('../config/mailer/ses.js');

// used to read in email template files
var fs = require("fs");

// used to compile the email templates
var ejs = require('ejs');

var common   = require('../config/common.js');
var config   = common.config();


exports.id = function(req, res) {

    //Search our users collection for the user with the activation id in the url
    var activationToken = req.param("id");

    User.findOne({ 'stats.activation_code': activationToken}, function (err, user) {

        //systematic error. Redirect to page so user can report error.
        if (err) {
            console.log("error");
            res.redirect('/404');

            // if no user is found, then this is a bad activation id
        } else if (!user) {

            console.log("not a real id");
            res.redirect('/forgot?msg=Account already activated');


            // found user that needs activation
        } else if (user) {

            user.stats.activated = true;

            user.stats.activation_code = user.stats.activation_code + 1234;

            user.save(function(err) {
                if (err) {
                    throw err;
                } else {
                    res.redirect('/signin?email=' + user.local.email);
                }
            });

        }
    });
};






exports.forgotPassword = function(req, res){

    var email = req.body.email.toLowerCase();

    console.log(email);

    User.findOne({ 'local.email': email }, function (err, user) {

        // if there are any errors, return the error before anything else
        if (err)
            return res.json({error: err})

        // if no user is found, return the message
        if (!user)
            return res.json({error: "No user found with that email.  Sign up?"})

        user.local.resetPasswordToken = require('crypto').randomBytes(32).toString('hex');

        user.local.resetPasswordExpires = Date.now() + 360000; //1 hour

        user.save(function(err) {
            if (err) {
                throw err;
            } else {
                //Get the ejs template for registration email
                var reset_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/resetpassword_email_template.ejs', "utf8");

                //Variables for EJS to inject into template
                var emailObj =
                {
                    user:{
                        name: user.user_settings.name,
                        activation: config.hts.appURL+"/reset/"+user.local.resetPasswordToken+"/",
                        email: email
                    },
                    images:{
                        fb_logo: "https://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                        twitter_logo: "https://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                        hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                    }
                };

                //Merge the template
                var compiled_html = ejs.render(reset_template, emailObj);

                //Setup plain text email in case user cannot view Rich text emails
                var plain_text = "Click the link to reset your HashtagSell password.  "+emailObj.user.activation;

                //Build the email message
                var opts = {
                    from: "HashtagSell <no-reply@hashtagsell.com>",
                    to: email,
                    subject: "HashtagSell Password Reset",
                    html: compiled_html,
                    text: plain_text
                };

                // Send Forgot password email
                mailer.sendMail(opts, function(error, info){
                    if(error){
                        console.log(error);
                        return res.json({success: false, message: "Could not send forgot password email.  Please contact support."})
                    }else{
                        console.log('Message sent: ' + info.response);
                        return res.json({success: true})
                    }
                });
            }
        });
    });
};






exports.reset = function(req, res){



    if(req.body.token && req.body.password) {  //user forgot their password and is recovering via email

        var token = req.body.token;
        var password = req.body.password;

        User.findOne({'local.resetPasswordToken': token}, function (err, user) {

            // if there are any errors, return the error before anything else
            console.log(user);

            if (err) {
                console.log(err);
                return res.json(
                    {
                        error: err
                    }
                )

                // if no user is found, return the message
            } else if (!user) {
                return res.json(
                    {
                        error: "Token expired.  www.hashtagSell.com/forgot to get a new token."
                    }
                )


            } else if (user) {

                user.local.resetPasswordExpires = undefined;
                user.local.resetPasswordToken = undefined;
                user.local.password = user.generateHash(password);


                user.save(function (err) {
                    if (err) {
                        throw err;
                    } else {
                        return res.json(
                            {
                                success: true,
                                email: user.local.email
                            }
                        )

                    }
                });
            }
        });
    } else if (req.body.currentPassword && req.body.newPassword) {  // User is updating their password from user settings.

        var email = req.user.local.email;
        var currentPassword = req.body.currentPassword;
        var newPassword = req.body.newPassword;

        User.findOne({'local.email': email}, function (err, user) {

            // if there are any errors, return the error before anything else
            console.log(user);

            if (err) {
                console.log(err);
                return res.json(
                    {
                        error: err
                    }
                );

                // if no user is found, return the message
            } else if (!user) {
                return res.json(
                    {
                        error: "Couldn't find user.  Please contact support."
                    }
                );


            } else if (user) { //found user with email.  check if current passwords match.

                if(user.validPassword(currentPassword)){

                    user.local.password = user.generateHash(newPassword);


                    user.save(function (err) {
                        if (err) {
                            throw err;
                        } else {
                            return res.json(
                                {
                                    success: true
                                }
                            );

                        }
                    });



                } else {

                    return res.json(
                        {
                            error: "Current password incorrect."
                        }
                    );
                }
            }
        });


    }
};






exports.signup = function(req, res) {

    var email = req.body.email.toLowerCase();
    var password = req.body.password;
    //var secret = req.body.secret;
    var username = req.body.name.toLowerCase();
    var betaAgreement = req.body.betaAgreement;

    console.log(email, password, username, betaAgreement);


    //Early_Access_Keys.findOne({ 'secret.key' : secret }, function(err, access_key){
    //    // if errors looking up secret, return the error
    //
    //    if (err)
    //        return res.json({ error: err });
    //
    //    // That secret is not found
    //    if(!access_key)
    //        return res.json({ error : "Not a valid access code"});
    //
    //    //That secret is already taken
    //    if(access_key.secret.expired) {
    //        return res.json({ error: "Access code already used. :("});
    //
    //        //Valid Early_Access_Keys Fount!
    //    } else {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return res.json({ error: err });

                // check to see if there is already a user with that email
                if (user) {
                    return res.json({ error: 'The email you entered belongs to an existing account.'});
                } else {

                    User.findOne({ 'user_settings.name' :  username }, function(err, user) {

                        // if there are any errors, return the error
                        if(err)
                            return res.json({ error: err });

                        if (user) {
                            return res.json({ error: 'That username is already taken. :('});
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser            = new User();

                            // set the user's local credentials
                            newUser.local.email    = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.user_settings.name = username;
                            newUser.stats.readBetaAgreement = betaAgreement;


                            //Link the staging users account to all the appropriate staging environment accounts.
                            //if(process.env.NODE_ENV === "STAGING" || process.env.NODE_ENV === "PRODUCTION"){
                            //    newUser.user_settings.linkedAccounts = {
                            //        "facebook" : {
                            //            "token" : "CAAGhqsUnSnIBAI5D6p1FAjmcEelu8ZAp3JU2mBkZBm05BesD1i514mHvt9nParVsbdCt08ZBzkOC3eLImZAbNQpzSPRqUAs04TT5zUNaCoinfzdEWJTXSP63IYMz3Yu1z2PS4bOBotS7VfMs5PviJBLmLHOTk7qDAMOUtsQohdZAAo1KzPMeFLZBqakcLtxa5P6ZCzyL3FlxHmgWQO2xFdO",
                            //            "name" : "hts user",
                            //            "id" : "100178336986619",
                            //            "email" : "hts_aikathw_user@tfbnw.net"
                            //        },
                            //        "twitter" : {
                            //            "username" : "hts_beta_user",
                            //            "tokenSecret" : "OHfjzTkp8x8kA73eUDHaP6ZrWs39UiicPer8Fc0TNP9gP",
                            //            "token" : "3192595494-QXne3zc6iNxNf6nzPbQk6GleNzpbYJAKyJ0C4K7",
                            //            "id" : "3192595494",
                            //            "displayName" : "hts beta user"
                            //        },
                            //        "ebay" : {
                            //            "timestamp" : "2015-05-12T01:11:47.798Z",
                            //            "version" : "915",
                            //            "build" : "E915_CORE_API_17441756_R1",
                            //            "eBayAuthToken" : "AgAAAA**AQAAAA**aAAAAA**UlNRVQ**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhDZaFpg+dj6x9nY+seQ**oxgDAA**AAMAAA**Eljvh3E7PH9IwfYqQ1K6juNplXJAazUBQfS0RQk0D40l4q3W4i7HEEPIBQDoOsio/3t7abQRHQKPnkNEQbTUEqmlA64EY/fvXxrm7cJWnHRnHB2LmCMATfoD+RL39QFS2M1JCie9dA1OJAtJnT+FyW5eoX3GnS4c1JiYT0u6gS2lOWbabRc9aHP0dPzYlpvh9HIsYU6cBltz1i2nMGPlWx9C9E+MPifDALzgAly+zEI5RV0X10wK+N7fKRSpRazRtZpfjF2H0KWyZczwqESA/jNPqx5W6UxuVCzsklYkSwpHi0rBc3UVyd6ZXhyQjQmxrPbociSln+o/4bWoFBYdMBwNkwpRphkS3H2Doz8jJS+jn8z9bbXmyc52KtcpM84dhU1cAsi7Ow7NvWZ81DnqIjRCwsBc3BWILK1XNAeP1nq86Zl6fWGX5zuaaTSW6jScLSDB05xPNBwTehs6uOvzYBQnklvadzxtxVYlV6ERnDmYaPZwJWBmpuci/JwJ0rGL+mJ5bSZtMPYYVCe4ao3MDbm1kw+CT16yjkbfm4Jct+Gtfv2YfCqhNDoFkrlyr7qa4gckX+h+dvTrUxCkw8ytDbKwYZtxVjMrCu5T5v5m/5GoHB2aRW4cVLhLIi1dVb2m0qyIXhukSjXZ9waXrN6uolUpXPC8ImfhVxJYUAvH3Tsj/f0y9rtXP6i75C2B3r2pm+pwc8TANUJqtRdpulhlPwAdIQpdZAiQp6rR7v/Vh09uiFRN6mvZgX3GCEWrVosx",
                            //            "hardExpirationTime" : "2016-11-02T01:11:46.000Z"
                            //        }
                            //    };
                            //}


                            // save the user
                            newUser.save(function(err) {
                                if (err) {
                                    throw err;
                                } else {

                                    //Generate New Early_Access_Keys Key For New User To Share
                                    //var keyToShare = require('crypto').randomBytes(3).toString('hex');
                                    //
                                    //var new_access_key = new Early_Access_Keys();
                                    //new_access_key.secret.key = keyToShare;
                                    //new_access_key.secret.type_of_key = "individual";
                                    //new_access_key.secret.generated_by = newUser.local.email;
                                    //new_access_key.secret.expired = false;
                                    //new_access_key.save();


                                    //Get the ejs template for registration email
                                    var registration_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/registration_email_template.ejs', "utf8");

                                    //Variables for EJS to inject into template
                                    var emailObj =
                                    {
                                        user:{
                                            name: newUser.user_settings.name,
                                            activation: config.hts.appURL+"/activate?id="+newUser.stats.activation_code,
                                            //keyToShare: keyToShare
                                        },
                                        images:{
                                            fb_logo: "https://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                                            twitter_logo: "https://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                                            hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                                        }
                                    };

                                    //Merge the template
                                    var compiled_html = ejs.render(registration_template, emailObj);

                                    //Setup plain text email in case user cannot view Rich text emails
                                    var plain_text = "Click the link to activate your HashtagSell account.  "+emailObj.user.activation;

                                    //Build the email message
                                    var opts = {
                                        from: "HashtagSell <no-reply@hashtagsell.com>",
                                        to: newUser.local.email,
                                        subject: "Welcome to HashtagSell!",
                                        html: compiled_html,
                                        text: plain_text
                                    };

                                    // Send Registration Email
                                    mailer.sendMail(opts, function(err, info){
                                        if(err){
                                            return res.json({ success : false, message: "could not send activation email.  Please email support."});
                                        }else{
                                            console.log(info);
                                            return res.json({ success : true});
                                        }
                                    });

                                    // Mark the OLD Secret Code as used
                                    //if(access_key.secret.type_of_key == "individual") {
                                    //    console.log("This is individual key");
                                    //    access_key.secret.expired = true;
                                    //    access_key.secret.used_by = [newUser.local.email];
                                    //    access_key.save();
                                    //} else if(access_key.secret.type_of_key == "group"){
                                    //    console.log("This is group key");
                                    //    access_key.secret.expired = false;
                                    //    access_key.secret.used_by.push(newUser.local.email);
                                    //    access_key.save();
                                    //} else { //This catches codes that were generated before we had types of keys
                                    //    access_key.secret.expired = true;
                                    //    access_key.secret.used_by = [newUser.local.email];
                                    //    access_key.save();
                                    //}

                                }
                            });
                        }
                    });
                }

            });
    //    }
    //});
};




exports.getProfile = function(req, res){

    var username = req.query.username;
    var userId = req.query.userId;

    if(username) {
        User.findOne({'user_settings.name': username}, function (err, user) {

            // if there are any errors, return the error before anything else
            if (err)
                return res.json({error: err});

            // if no user is found, return the message
            if (!user)
                return res.json({error: "No user found with that username."});

            if (user)
            //console.log(user);
                return res.json(
                    {
                        user: {
                            'profile_photo': user.user_settings.profile_photo,
                            'banner_photo': user.user_settings.banner_photo,
                            'email' : user.local.email,
                            'name': user.user_settings.name
                        }
                    }
                );
        });
    } else if (userId) {
        User.findOne({'_id': userId}, function (err, user) {

            // if there are any errors, return the error before anything else
            if (err)
                return res.json({error: err});

            // if no user is found, return the message
            if (!user)
                return res.json({error: "No user found with that Id."});

            if (user)
            //console.log(user);
                return res.json(
                    {
                        user: {
                            'profile_photo': user.user_settings.profile_photo,
                            'banner_photo': user.user_settings.banner_photo,
                            'name': user.user_settings.name
                        }
                    }
                );
        });
    }

};




exports.subscribe = function(req, res) {

    var subscriberEmail = req.body.email.toLowerCase();

    //Search our users collection for the user with the activation id in the url
    Subscriber.findOne({'email': subscriberEmail}, function (err, result) {

        if (err) { //systematic error. Redirect to page so user can report error.
            return res.json({success: false, message: "Sorry " + subscriberEmail + ", something went wrong.  Please try again in a few minutes."});
            throw error;


        } else if (result) { // if no user is found, then this is a bad activation id
            return res.json({success: true, message: subscriberEmail + " is already on our list.  Hang tight!"});


        } else if (!result) { // found user that needs activation

            var newSubscriber = Subscriber();

            newSubscriber.email = subscriberEmail;

            newSubscriber.save(function (err) {
                if (err) {
                    return res.json({success: false, message: "Sorry " + subscriberEmail + ", something went wrong.  Please try again in a few minutes."});
                    throw err;
                } else {
                    return res.json({success: true, message: "Alrighty!  We'll send you an access code shortly.  Hang tight!"});
                }
            });

        }
    });

};