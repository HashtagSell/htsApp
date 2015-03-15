var request = require("request");
var Analytics = require('../config/database/models/analytics.js');
var common   = require('../config/common.js');
var config   = common.config();


exports.newQuery = function (req, result, promise) {
    var vendorResponse = result.external;
    var vendorPosts = vendorResponse.postings;

    var term = result.query.q;
    var mongoCategories = [];


    var userLat = result.location.latitude;
    var userLong = result.location.longitude;

    console.log('Search term is: ' + term);

    for(var i=-0; i < result.popularCategories.length; i++){
        mongoCategories.push(result.popularCategories[i].category);
    }
    console.log('Mongo Cats are: ' + mongoCategories);
    console.log('Userlat: ' + userLat);
    console.log('Userlong: ' + userLong);

    if(vendorPosts.length > 0) {

        var furthestitem = vendorPosts[vendorPosts.length - 1];
        var furthestLat = furthestitem.geo.coordinates[0];
        var furthestLon = furthestitem.geo.coordinates[1];

        var maxDistance = getDistanceFromLatLonInMeters(userLat, userLong, furthestLat, furthestLon);

        var performDistanceQuery = function (minDistance) {

            console.log("Item furthese from user: ", furthestLat, furthestLon);
            console.log("Max distance in meters: ", maxDistance);
            console.log("Min distance in meters:  ", minDistance);

            var queryObject = {
                "geo": {
                    "min": minDistance,
                    "max": maxDistance,
                    "coords": [userLong, userLat].join(',')
                },
                "filters": {
                    "mandatory": {
                        "contains": {
                            "heading": term
                        }
                    },
                    "optional": {
                        "exact": {
                            "categoryCode": mongoCategories
                        }
                    }
                }
            };


            request({
                method : 'GET',
                strictSSL : config.hts.posting_api.strictSSL,
                timeout : config.hts.posting_api.timeout,
                url : config.hts.posting_api.url,
                qs: queryObject
            }, function (err, res, body) {

                //parse the response body
                var json = tryParseJSON(body);
                if (!json) {
                    json = {
                        response : body
                    };
                }

                // check for retry
                if (res && res.statusCode >= 500) {

                    console.log('status code greater than or equal to 500');

                    //return callback(err || json);

                    promise(null, vendorResponse);
                }

                if (!res) {
                    //return callback(
                    //    new Error('no response from server - possibly a remote server crash'));

                    console.log('no response from server - possibly a remote server crash');

                    promise(null, vendorResponse);

                }

                // if there is an error, kick it back
                if (err) {

                    console.log('we have an error querying posting API');

                    //return callback(err);

                    promise(null, vendorResponse);
                }

                vendorPosts = vendorPosts.concat(json.results);

                vendorPosts.sort(function(obj1, obj2) {
                    // Sort nearest to furthest
                    return obj1.geo.distance - obj2.geo.distance;
                });

                promise(null, vendorPosts);
            });


        };

        //Logs the users query and returns their previous search (if there is one) that way we know what concentric circle to define for distance query
        logQuery(req, vendorResponse, result, maxDistance, performDistanceQuery);

    } else {
        promise(null, vendorResponse);
    }

};



function tryParseJSON (body) {
    if (!body) {
        return null;
    }

    if (typeof body === 'object') {
        return body;
    }

    try {
        return JSON.parse(body);
    } catch (ex) {
        return null;
    }
}


function getDistanceFromLatLonInMeters(lat1,lon1,lat2,lon2) {
    var R = 6378100; // Radius of the earth in meters
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}


function deg2rad(deg) {
    return deg * (Math.PI/180);
}


function logQuery(req, vendorResponse, result, maxDistance, callback){
    //console.log("in log query");
    //
    //console.log(req.user);

    if(!req.user    ) {
        var email = "";
    } else {
        var email = req.user.local.email;
    }

    //console.log(email);

    var heading = result.query.q;

    //console.log(heading);

    var source = result.query.source;

    //console.log(source);

    var rpp = result.query.rpp;

    //console.log(rpp);

    var lat = result.location.latitude;

    //console.log(lat);

    var lon = result.location.longitude;

    //console.log(lon);

    var category = result.popularCategories;

    //console.log(category);

    var sort = result.query.sort;

    //console.log(sort);

    var retvals = result.query.retvals;

    //console.log(retvals);

    var anchor = vendorResponse.anchor;

    //console.log(anchor);

    var next_page = vendorResponse.next_page;

    //console.log(next_page);

    var next_tier = vendorResponse.next_tier;

    //console.log(next_tier);
    //
    //console.log("got all vars");


    Analytics.findOneAndUpdate(
        { anchor: anchor },
        {
            anchor: anchor,
            category: category,
            email: email,
            lat: lat,
            lon: lon,
            next_page: next_page,
            next_tier: next_tier,
            max_dist: maxDistance,
            heading: heading,
            retvals: retvals,
            rpp: rpp,
            sort: sort,
            source: source

        },
        { upsert: true, new:false },
        function(err, result){
            console.log("Caching query for pagination");
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