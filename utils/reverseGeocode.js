var request = require("request");
var common   = require('../config/common.js');
var config   = common.config();


exports.reverseGeocode = function(req, res){

    if(req.param('lat')) {
        var lat = req.param('lat');
    }

    if(req.param('long')) {
        var long = req.param('long');
    }

    console.log("we are in geocode", lat, long);


    var queryObject = {
        latlng: lat + "," + long,
        key: config.GOOGLE_SIMPLE_API
    }


    request({
        method : 'GET',
        url : "https://maps.googleapis.com/maps/api/geocode/json",
        qs: queryObject
    }, function (err, webResponse, body) {

        //parse the response body
        //var json = tryParseJSON(body);
        //if (!json) {
        //    json = {
        //        response : body
        //    };
        //}
        //
        //// check for retry
        //if (res && res.statusCode >= 500) {
        //
        //    console.log('status code greater than or equal to 500');
        //
        //    //return callback(err || json);
        //
        //    promise(null, vendorResponse);
        //}
        //
        //if (!res) {
        //    //return callback(
        //    //    new Error('no response from server - possibly a remote server crash'));
        //
        //    console.log('no response from server - possibly a remote server crash');
        //
        //    promise(null, vendorResponse);
        //
        //}
        //
        //// if there is an error, kick it back
        //if (err) {
        //
        //    console.log('we have an error querying posting API');
        //
        //    //return callback(err);
        //
        //    promise(null, vendorResponse);
        //}
        //
        //vendorPosts = vendorPosts.concat(json.results);
        //
        //vendorPosts.sort(function(obj1, obj2) {
        //    // Sort nearest to furthest
        //    return obj1.geo.distance - obj2.geo.distance;
        //});
        //
        //promise(null, vendorPosts);

        res.json(JSON.parse(body));
    });


}