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



exports.adminLookupAccount = function(req, res) {

    //Search our users collection by the username and update their user_settings object
    User.findOne({ 'user_settings.name': req.params.username }, function (err, user) {

        //systematic error. Redirect to page so user can report error.
        if (err) {
            console.log("error");
            res.json({error : err});

            // if no user is found, then this is a bad activation id
        } else if (!user) {

            res.json({error : "username not found"});

            // found user that needs activation
        } else if (user) {
            res.json(user);

        }
    });
};




exports.deleteAccount = function (req, res) {

    var id = req.user._id;

    User.findOne({'_id': id}, function (err, user) {

        // if there are any errors, return the error before anything else
        if (err)
            return res.json({error: err});

        // if no user is found, return the message
        if (!user)
            return res.json({error: "No user found with that email."});

    }).remove().exec();
};