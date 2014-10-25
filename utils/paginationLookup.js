/**
 * Created by braddavis on 10/21/14.
 */
// load up the analytics model
var Analytics = require('../config/database/models/analytics.js');

exports.getAnchorDetails = function(params, callback){

    var query  = Analytics.where({ anchor: params.anchor });

    query.findOne(function (err, anchorDetails) {
        if (err) {
            callback(err, null);
        } else if (anchorDetails) {
            callback(null, anchorDetails);
        }
    });

};