// load up the analytics model
var User = require('../config/database/models/user.js');
var fs = require('fs');
var async = require('async');
var AWS = require('aws-sdk');
var common   = require('../config/common.js');
var config   = common.config();

AWS.config.region = 'us-west-2';
AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

exports.push = function(req, res) {

    var updatedUserSettings = req.body.userSettings;

    console.log(updatedUserSettings);

    //Search our users collection by the username and update their user_settings object
    User.findOne({ 'user_settings.name': updatedUserSettings.name }, function (err, user) {

        //systematic error. Redirect to page so user can report error.
        if (err) {
            console.log("error");
            res.json({error : err});

            // if no user is found, then this is a bad activation id
        } else if (!user) {

            console.log("Server could not find user to update");
            res.json({error : "user name not found"});


            // found user that needs activation
        } else if (user) {

            user.user_settings = updatedUserSettings;

            user.save(function(err) {
                if (err) {
                    throw err;
                } else {
                    res.json({success:"success"});
                }
            });

        }
    });
};




exports.getUserSettings = function(req, res) {

    //Search our users collection by the username and update their user_settings object
    User.findOne({ '_id': req.user._id }, function (err, user) {

        //systematic error. Redirect to page so user can report error.
        if (err) {
            console.log("error");
            res.json({error : err});

            // if no user is found, then this is a bad activation id
        } else if (!user) {

            res.json({error : "user name not found"});

            // found user that needs activation
        } else if (user) {

            res.json(user.user_settings);

        }
    });
};




exports.updateUserPhotos = function (req, res) {

    console.log('here is request!!', req);

    async.waterfall([
        function(callback){

            console.log("***************************");
            console.log("Get profile photo payload");
            console.log("***************************");

            if(req.files.profilePhoto) {
                var image = req.files.profilePhoto;
                image.type = 'profilePhoto';
            } else if (req.files.bannerPhoto) {
                var image = req.files.bannerPhoto;
                image.type = 'bannerPhoto';
            }

            console.log(image);

            fs.readFile(image.path, function (err, file_buffer) {

                if(err){

                    callback(err);

                } else {

                    if(image.type === 'profilePhoto') {

                        var params = {
                            ACL: 'public-read',
                            Bucket: config.aws.s3_static_bucket,
                            Key: 'users/' + req.user._id + '/profile-photo/' + image.name,
                            Body: file_buffer,
                            ContentType: image.mimetype
                        };

                    } else if (image.type === 'bannerPhoto') {

                        var params = {
                            ACL: 'public-read',
                            Bucket: config.aws.s3_static_bucket,
                            Key: 'users/' + req.user._id + '/banner-photo/' + image.name,
                            Body: file_buffer,
                            ContentType: image.mimetype
                        };

                    }



                    callback(null, params, image);
                }

            });
        },
        function(params, image, callback){

            console.log("***************************");
            console.log("PUSH TO AWS S3 BUCKET");
            console.log("***************************");

            var S3 = new AWS.S3();

            S3.putObject(params, function (err, S3response) {

                if (err) {
                    callback(err);
                } else {
                    callback(null, params, image);
                }


            });
        },
        function(params, image, callback){
            // arg1 now equals 'three'
            console.log("***************************");
            console.log("REMOVE IMAGE FROM SERVER AFTER SUCCESSFUL UPLOAD TO S3");
            console.log("***************************");

            fs.unlink(image.path, function (err) {
                if (err) {
                    callback(err);

                } else {
                    callback(null, params, image);

                }
            });
        },
        function(params, image, callback){
            // arg1 now equals 'three'

            console.log("***************************");
            console.log("SAVE NEW PROFILE PHOTO TO USER IN DATABASE");
            console.log("***************************");

            User.findOne({'local.email': req.user.local.email}, function (err, user) {

                // if there are any errors, return the error before anything else
                console.log(user);

                if (err) {

                    callback(err);

                    // if no user is found, return the message
                } else if (!user) {
                    return res.json(
                        {
                            error: "Couldn't find user.  Please contact support."
                        }
                    );


                } else if (user) { //found user with email.  check if current passwords match.

                    var S3ImageUrl = '';

                    if(image.type === 'profilePhoto') {
                        S3ImageUrl = config.aws.s3_static_url + '/users/' + req.user._id + '/profile-photo/' + image.name;
                        user.user_settings.profile_photo = S3ImageUrl;
                    } else if (image.type === 'bannerPhoto') {
                        S3ImageUrl = config.aws.s3_static_url + '/users/' + req.user._id + '/banner-photo/' + image.name;
                        user.user_settings.banner_photo = S3ImageUrl;
                    }

                    user.save(function (err) {
                        if (err) {
                            callback(err);
                        } else {

                            callback( null, {
                                success : true,
                                url : S3ImageUrl
                            });
                        }
                    });

                }
            });
        }
    ], function (err, result) {
        // result now equals 'done'
        if(err){
            res.send(err);
        } else {
            res.send(result);
        }
    });
};