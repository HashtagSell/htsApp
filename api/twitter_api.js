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

    var posting = req.body.posting;

    if(posting.images.length){

        var postingImg = posting.images[0].full;

        var request = require('request').defaults({ encoding: null });

        request.get(postingImg, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                client.post('media/upload', {media: body}, function callback(error, media, response) {
                        if (error) {
                            res.send({success: false, data: error});
                        } else {

                            var tweetWithPhoto = {};

                            if(!posting.geo.coordinates) {
                                tweetWithPhoto = {
                                    status: posting.plainTextBody.substring(0, 55) + '... ' + configAuth.hts.appURL + '/feed/' + posting.postingId,
                                    media_ids: media.media_id_string
                                };
                            } else {
                                tweetWithPhoto = {
                                    status: posting.plainTextBody.substring(0, 55) + '... ' + configAuth.hts.appURL + '/feed/' + posting.postingId,
                                    media_ids: media.media_id_string,
                                    lat: posting.geo.coordinates[1],
                                    long: posting.geo.coordinates[0],
                                    display_coordinates: true
                                };
                            }


                            console.log('OUR TWITTER STATUS LENGTH IS THIS MANY CHARACTERS', tweetWithPhoto.status.length);
                            console.log(tweetWithPhoto);

                            client.post('statuses/update', tweetWithPhoto, function (error, tweet, response) {
                                if (error) {
                                    console.log(error);
                                    res.send(error);
                                } else {
                                    console.log(tweet);
                                    res.send(tweet);
                                }
                            });
                        }
                    }
                );
            } else {
                res.send({success: false, data: error});
            }
        });

    } else {

        var tweet = {};

        if(!posting.geo.coordinates) {
            tweet = {
                status: posting.plainTextBody.substring(0, 78) + '... ' + configAuth.hts.appURL + '/feed/' + posting.postingId
            };
        } else {
            tweet = {
                status: posting.plainTextBody.substring(0, 78) + '... ' + configAuth.hts.appURL + '/feed/' + posting.postingId,
                lat: posting.geo.coordinates[1],
                long: posting.geo.coordinates[0],
                display_coordinates: true
            };
        }

        console.log('OUR TWITTER STATUS LENGTH IS THIS MANY CHARACTERS', tweet.status.length);
        console.log(tweet);

        client.post('statuses/update', tweet,  function(error, tweet, response){
            if(error) {
                res.send(error);
            } else {
                res.send(tweet);
            }
        });
    }
};





//Disconnect from a user's twitter account
exports.disconnectAccount = function (req, res) {
    var user_id = req.user._id;

    User.update({'_id': user_id}, {$unset: {'user_settings.linkedAccounts.twitter': 1 }}, function () {
        res.send({});
    });

};