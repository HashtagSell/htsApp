/**
 * Created by braddavis on 4/16/15.
 */
/**
 * Created by braddavis on 4/14/15.
 */
var User = require('../config/database/models/user.js');
var FB = require('fb');

var common   = require('../config/common.js');
var configAuth  = common.config();



exports.extendFBTokenExpiry = function (req, res) {
    FB.api('oauth/access_token', {
        client_id: configAuth.facebookAuth.clientID,
        client_secret: configAuth.facebookAuth.clientSecret,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: 'existing_access_token'
    }, function (res) {
        if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }

        var accessToken = res.access_token;
        var expires = res.expires ? res.expires : 0;
    });
};




exports.disconnectAccount = function (req, res) {

    var user_id = req.user._id;

    User.update({'_id': user_id}, {$unset: {'user_settings.linkedAccounts.facebook': 1 }}, function () {
        res.send({});
    });
};