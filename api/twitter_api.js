/**
 * Created by braddavis on 4/16/15.
 */
var User = require('../config/database/models/user.js');
var Twitter = require('twitter');

var common   = require('../config/common.js');
var configAuth  = common.config();


var client = new Twitter({
    consumer_key: configAuth.twitterAuth.consumerKey,
    consumer_secret: configAuth.twitterAuth.consumerSecret,
    access_token_key: configAuth.twitterAuth.accessToken,
    access_token_secret: configAuth.twitterAuth.accessTokenSecret
});


exports.publishToTwitter = function (req, res) {

    var client = new Twitter({
        consumer_key: configAuth.twitterAuth.consumerKey,
        consumer_secret: configAuth.twitterAuth.consumerSecret,
        access_token_key: req.body.token,
        access_token_secret: req.body.tokenSecret
    });


    client.post('statuses/update', {status: req.body.status},  function(error, tweet, response){
        if(error) {
            res.send(error);
        } else {
            res.send(tweet);
        }
    });
};





//Disconnect from a user's twitter account
exports.disconnectAccount = function (req, res) {
    var user_id = req.user._id;

    User.update({'_id': user_id}, {$unset: {'user_settings.linkedAccounts.twitter': 1 }}, function () {
        res.send({});
    });

};