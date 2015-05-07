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
    User.findOne({ 'stats.activation_code': req.param("id") }, function (err, user) {

        //systematic error. Redirect to page so user can report error.
        if (err) {
            console.log("error");
            res.redirect('/404');

            // if no user is found, then this is a bad activation id
        } else if (!user) {

            console.log("not a real id");
            res.redirect('/forgot?msg=Account already activated.');


            // found user that needs activation
        } else if (user) {

            user.stats.activated = true;

            user.stats.activation_code = undefined;

            user.save(function(err) {
                if (err) {
                    throw err;
                } else {
                    res.redirect('/signin?email=' + user.local.email + '&tour=true');
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
    var secret = req.body.secret;
    var username = req.body.name.toLowerCase();

    console.log(email, password, secret, username);


    Early_Access_Keys.findOne({ 'secret.key' : secret }, function(err, access_key){
        // if errors looking up secret, return the error

        if (err)
            return res.json({ error: err });

        // That secret is not found
        if(!access_key)
            return res.json({ error : "Not a valid access code"});

        //That secret is already taken
        if(access_key.secret.expired) {
            return res.json({ error: "Access code already used. :("});

            //Valid Early_Access_Keys Fount!
        } else {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return res.json({ error: err });

                // check to see if there is already a user with that email
                if (user) {
                    return res.json({ error: 'That email is already taken.  Forget your password?'});
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

                            // save the user
                            newUser.save(function(err) {
                                if (err) {
                                    throw err;
                                } else {

                                    //Generate New Early_Access_Keys Key For New User To Share
                                    var keyToShare = require('crypto').randomBytes(3).toString('hex');

                                    var new_access_key = new Early_Access_Keys();
                                    new_access_key.secret.key = keyToShare;
                                    new_access_key.secret.type_of_key = "individual";
                                    new_access_key.secret.generated_by = newUser.local.email;
                                    new_access_key.secret.expired = false;
                                    new_access_key.save();


                                    //Get the ejs template for registration email
                                    var registration_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/registration_email_template.ejs', "utf8");

                                    //Variables for EJS to inject into template
                                    var emailObj =
                                    {
                                        user:{
                                            name: newUser.user_settings.name,
                                            activation: config.hts.appURL+"/activate?id="+newUser.stats.activation_code,
                                            keyToShare: keyToShare
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
                                    if(access_key.secret.type_of_key == "individual") {
                                        console.log("This is individual key");
                                        access_key.secret.expired = true;
                                        access_key.secret.used_by = [newUser.local.email];
                                        access_key.save();
                                    } else if(access_key.secret.type_of_key == "group"){
                                        console.log("This is group key");
                                        access_key.secret.expired = false;
                                        access_key.secret.used_by.push(newUser.local.email);
                                        access_key.save();
                                    } else { //This catches codes that were generated before we had types of keys
                                        access_key.secret.expired = true;
                                        access_key.secret.used_by = [newUser.local.email];
                                        access_key.save();
                                    }

                                }
                            });
                        }
                    });
                }

            });
        }
    });
};




exports.getProfile = function(req, res){

    var username = req.query.username;

    User.findOne({ 'user_settings.name' : username }, function (err, user) {

        // if there are any errors, return the error before anything else
        if (err)
            return res.json({error: err});

        // if no user is found, return the message
        if (!user)
            return res.json({error: "No user found with that username."});

        if(user)
            //console.log(user);
            return res.json(
                {user: {
                    'profile_photo': user.user_settings.profile_photo,
                    'banner_photo': user.user_settings.banner_photo,
                    'name': user.user_settings.name
                    }
                }
            );
    });

};