/**
 * Created by braddavis on 4/14/15.
 */
var ebay = require('./ebay-trading-api/index');
var common   = require('../config/common.js');
var config   = common.config();
var User = require('../config/database/models/user.js');

exports.getSessionId = function(req, res){


    var params = {
        callname: 'GetSessionID',
        siteid: 0,
        data: {
            RuName: config.ebay.app.RuName
        }
    };


    ebay.call(params, function(err, result) {
        if(!err){
            res.send(result);
        }
    });


};


exports.fetchToken = function(req, res) {

    var params = {
        callname: 'FetchToken',
        siteid: 0,
        data: {
            SessionID: req.query.sessionId
        }
    };

    ebay.call(params, function(err, result) {

        if(!err){

            if(result.FetchTokenResponse.Ack === 'Success') {
                var user_id = req.user._id;

                User.findOne({'_id': user_id}, function (err, user) {


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

                        user.user_settings.linkedAccounts.ebay.timestamp = result.FetchTokenResponse.Timestamp;
                        user.user_settings.linkedAccounts.ebay.version = result.FetchTokenResponse.Version;
                        user.user_settings.linkedAccounts.ebay.build = result.FetchTokenResponse.Build;
                        user.user_settings.linkedAccounts.ebay.eBayAuthToken = result.FetchTokenResponse.eBayAuthToken;
                        user.user_settings.linkedAccounts.ebay.hardExpirationTime = result.FetchTokenResponse.HardExpirationTime;

                        user.save(function (err) {
                            if (err) {
                                throw err;
                            } else {
                                res.send({
                                    "success": true,
                                    "ebay": user.user_settings.linkedAccounts.ebay
                                });
                            }
                        });
                    }
                });

            } else if(result.FetchTokenResponse.Ack === 'Failure') {

                res.send({
                    "success": false,
                    "ebay": result.FetchTokenResponse
                });
            }
        }
    });
};




exports.disconnectAccount = function (req, res) {

    var user_id = req.user._id;

    User.update({'_id': user_id}, {$unset: {'user_settings.linkedAccounts.ebay': 1 }}, function () {
        res.send({});
    });

};