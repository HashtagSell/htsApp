var request = require("request");
var analyticsApi = require("./analytics_datastore_api.js");
var DataStore = require("../config/database/models/datastore.js");
var path = require('path');


exports.vendor = function(req, res){
	
	var three_taps_api = "http://search.3taps.com";
	var auth_token = "&auth_token=f2862071ede0bbd93bee4f091c522a9e";
	var hts_app_query = req._parsedUrl.search;
	var cat_query = three_taps_api+hts_app_query+auth_token;

	
	request(cat_query, function(error, response, body) {
	    if (!error && response.statusCode == 200) {

            if(req.query.datastore) {

                var host = req.headers.host;

                console.log("datastore requested!!!!");

                console.log("our host is! "+host);

                buildDataStore(host, response);
            }


            //This query is not just for category algorithm
            if(req.param("internal")) {

                console.log("internal!!!");

                var callback = function(body){

                    res.send(body);
                };

                search_hts_posts(req, body, callback);

            } else {
                res.send(body);
            }

        } else if(error){
            res.send(response);
        }
	});
};



function search_hts_posts(req, body, callback){

    // load up the Post model
    var PostModel = require('../config/database/models/hts_post_model.js');


    //This is the string the user typed in.  We uses mongos text index search with the hashtags of items in db
    var heading = req.query.heading;


    //takes in &category=VAUT|RVAC|~PPPP|~PMSM|~PMSW and converts to [{category: VAUT}, {category, RVAC}]
    if(req.query.category) {
        var mongoCategories = [];
        var categoryArray = req.query.category.split("|");
        for (i in categoryArray) {
            var category = categoryArray[i];
            if (category.indexOf('~') === -1) { //category does not contain ~ and we should search within this category
                mongoCategories.push({category: category});
            }
        }
    }

    var vendorResponse = JSON.parse(body);
    var vendorPosts = vendorResponse.postings;


    var userLat = req.query.lat;
    var userLong = req.query.long;

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
                coordinates: { $near: {
                    $geometry: { type: "Point", coordinates: [ userLong , userLat ] },
                    $maxDistance: maxDistance,
                    $minDistance: minDistance
                }
                },
                $or: mongoCategories,
                heading: { "$regex": heading, "$options": 'i' }
            }, function (err, hts_results) {
                //systematic error. Redirect to page so user can report error.
                if (err) {
                    console.log(err);
                    callback(body);

                    // if no user is found, then this is a bad activation id
                } else if (!hts_results.length) {

                    console.log("no internal results found");

                    var sortedVendorPosts = sortByDistance(vendorPosts, userLat, userLong);
                    vendorResponse.postings = sortedVendorPosts;
                    callback(vendorResponse);

                } else if (hts_results) {

                    console.log(hts_results);


                    for (var i in hts_results) {
                        var hts_result = hts_results[i];

                        vendorPosts.push(hts_result);
                    }

                    var sortedVendorPosts = sortByDistance(vendorPosts, userLat, userLong);

                    vendorResponse.postings = sortedVendorPosts;

                    callback(vendorResponse);


                }
            });
        }

        //Logs the users query and returns their previous search (if there is one) that way we know what concentric circle to define for distance query
        analyticsApi.logQuery(req, vendorResponse, maxDistance, performDistanceQuery);

    } else {
        callback(vendorResponse);
    }

}



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

    return sortedPostings;
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
    return deg * (Math.PI/180)
}






// ============================================================
// Everything Below For Demo Purposes Only ====================
// ============================================================
exports.demo = function(req, res){

    var heading = req.query.heading;
    var page = 1;

    if(req.query.page) {

        page = parseInt(req.query.page)+1;

    }

    console.log(heading, page);

    //Search our users collection for the user with the activation id in the url
    DataStore.findOne({ 'result.query': heading, 'result.next_page': page}, function (err, response) {

            //Err looking up cached search result
        if (err) {
            console.log("error");
            return res.json({error: err});

            //found result
        } else if (response) {
            return res.json(response.result);

        } else if (!response){
            return res.json({error : "nothing found"});
        }
    });

};

function buildDataStore(host, response){

    var jsonResponse = JSON.parse(response.body);

    for(i=0; i<jsonResponse.postings.length; i++){
        if(jsonResponse.postings[i].images){
            for(j=0; j<jsonResponse.postings[i].images.length; j++) {


                var imgURL = "";
                var filename = "";
                var hts_url = "http://www.hashtagsell.com/datastore/";
                var filepath = __dirname+"/../public/images/datastore/";


                if(jsonResponse.postings[i].images[j].full) {

                    imgURL = jsonResponse.postings[i].images[j].full;

                    filename = imgURL.substr(imgURL.lastIndexOf('/') + 1);

                    hts_url += filename;

                    jsonResponse.postings[i].images[j].full = hts_url;

                    filepath += filename;


                } else if(jsonResponse.postings[i].images[j].images){

                    imgURL = jsonResponse.postings[i].images[j].images;

                    filename = imgURL.substr(imgURL.lastIndexOf('/') + 1);

                    hts_url += filename;

                    jsonResponse.postings[i].images[j].images = hts_url;

                    filepath += filename;


                } else if(jsonResponse.postings[i].images[j].thumb){

                    imgURL = jsonResponse.postings[i].images[j].thumb;

                    filename = imgURL.substr(imgURL.lastIndexOf('/') + 1);

                    hts_url += filename;

                    jsonResponse.postings[i].images[j].thumb = hts_url;

                    filepath += filename;

                }


                downloadPhoto(imgURL, filepath, function(){
                    console.log('done');
                });

            }
        }

    }


    addToDatabase(jsonResponse);
}


function addToDatabase(jsonResponse){

    var dataStore = new DataStore();
    dataStore.result = jsonResponse;
    dataStore.save(function(err) {
        if (err) {
            console.log(err);
            throw err;
        } else {

        }
    });
}


var downloadPhoto = function(uri, filepath, callback){
    console.log(uri, filepath);
    request.head(uri, function(err, res, body){

    request(uri).pipe(require('fs').createWriteStream(filepath)).on('close', callback);
    });
};