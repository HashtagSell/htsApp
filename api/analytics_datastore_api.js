// load up the analytics model
var Analytics = require('../config/database/models/analytics.js');

exports.logQuery = function(req, vendorResponse, maxDistance, callback){

    var email = req.user.local.email;
    var heading = req.param("heading");
    var source = req.param("source");
    var rpp = req.param("rpp");
    var lat = req.param("lat");
    var lon = req.param("long");
    var category = req.param("category");
    var sort = req.param("sort");
    var retvals = req.param("retvals");

    var anchor = vendorResponse.anchor;
    var next_page = vendorResponse.next_page;
    var num_matches = vendorResponse.num_matches;

    Analytics.findOneAndUpdate(
        { anchor: anchor },
        {
            anchor: anchor,
            category: category,
            email: email,
            lat: lat,
            lon: lon,
            next_page: next_page,
            num_matches: num_matches,
            max_dist: maxDistance,
            heading: heading,
            retvals: retvals,
            rpp: rpp,
            sort: sort,
            source: source

        },
        { upsert: true, new:false },
        function(err, result){
            if(err){
                console.log(err);
            } else if (!result){
                callback(0);
            } else if(result){
                callback(result.max_dist);
            }

        }
    );

};