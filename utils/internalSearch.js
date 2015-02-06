// load up the Post model
var PostModel = require('../config/database/models/hts_post_model.js');
var request = require("request");
var Analytics = require('../config/database/models/analytics.js');

exports.query = function(req, result, promise){

    var vendorResponse = result.external;
    var vendorPosts = vendorResponse.postings;
    var term = result.query.q;
    var mongoCategories = result.popularCategories;


    var userLat = result.location.latitude;
    var userLong = result.location.longitude;

    console.log('search term is: ' + term);
    console.log('mongo Cats are: ' + mongoCategories);
    console.log('userlat: ' + userLat);
    console.log('userlong: ' + userLong);

    if(vendorPosts.length > 0) {

        var furthestitem = vendorPosts[vendorPosts.length - 1];
        var furthestLat = furthestitem.location.lat;
        var furthestLon = furthestitem.location.long;

        var maxDistance = getDistanceFromLatLonInMeters(userLat, userLong, furthestLat, furthestLon);

        var performDistanceQuery = function (minDistance) {

            console.log("user loc: ", userLat, userLong);
            console.log("max loc: ", furthestLat, furthestLon);
            console.log("our max distance in meters: ", maxDistance);
            console.log("our min distance in meters:  ", minDistance);

            //TODO Complex regex full text search logic to be added.  Consider elasticsearch mongo connnector or track mongo ticket https://jira.mongodb.org/browse/DOCS-1719
            //TODO We want to use geospacial indexing and full text indexing in one query but this can't be done today with mongo: http://stackoverflow.com/questions/25922965/mongodb-text-with-near
            PostModel.find({
                coordinates: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [ userLong , userLat ]
                        },
                        $maxDistance: maxDistance,
                        $minDistance: minDistance
                    }
                },
                $or: mongoCategories,
                heading: { "$regex": term, "$options": 'i' }
            }, function (err, hts_results) {
                //systematic error. Redirect to page so user can report error.
                if (err) {
                    console.log(err);
                    promise(err, null);

                    // if no user is found, then this is a bad activation id
                } else if (!hts_results.length) {

                    console.log("no internal results found");

                    var sortedVendorPosts = sortByDistance(vendorPosts, userLat, userLong);
                    vendorResponse.postings = sortedVendorPosts;
                    promise(null, vendorResponse);

                } else if (hts_results) {

                    console.log(hts_results);


                    for (var i in hts_results) {
                        var hts_result = hts_results[i];

                        vendorPosts.push(hts_result);
                    }

                    var sortedVendorPosts = sortByDistance(vendorPosts, userLat, userLong);

                    vendorResponse.postings = sortedVendorPosts;

                    promise(null, vendorResponse);

                }
            });
        };

        //Logs the users query and returns their previous search (if there is one) that way we know what concentric circle to define for distance query
        logQuery(req, vendorResponse, result, maxDistance, performDistanceQuery);

    } else {
        promise(null, vendorResponse);
    }

};



function sortByDistance(postings, userLat, userLong) {

    for (i in postings) {
        var post = postings[i];
        var postLong = post.location.long;
        var postLat = post.location.lat;

        post.distanceFromUser = getDistanceFromLatLonInMiles(userLat, userLong, postLat, postLong);
    }


    var sortedPostings = postings.sort(function (a, b) {
        return a.distanceFromUser - b.distanceFromUser;
    });

    return sortedPostings
}


function getDistanceFromLatLonInMiles(lat1,lon1,lat2,lon2) {
    var R = 3963.1676; // Radius of the earth in meters
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
            console.log("we are here");
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