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

        res.json(JSON.parse(body));
    });


}