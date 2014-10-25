// load up the analytics model
var User = require('../config/database/models/user.js');

exports.push = function(req, res) {

    console.log("we're in here")

    var updatedUserSettings = req.body.userSettings;

    //Search our users collection by the username and update their user_settings object
    User.findOne({ 'user_settings.name': updatedUserSettings.name }, function (err, user) {

        //systematic error. Redirect to page so user can report error.
        if (err) {
            console.log("error");
            res.json({error : err});

            // if no user is found, then this is a bad activation id
        } else if (!user) {

            console.log("not a real id");
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