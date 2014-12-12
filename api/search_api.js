var request = require("request");
var analyticsApi = require("./analytics_datastore_api.js");
var path = require('path');
var async = require('async');
var Promise = require('promise');
var geolocation = require("../utils/ipgeolocation.js");
var popularCategories = require("../utils/getPopularCategory.js");
var vendorSearch = require("../utils/vendorSearch.js");
var vendorCleanup = require("../utils/vendorCleanup.js");
var internalSearch = require("../utils/internalSearch.js");
var pagination = require("../utils/paginationLookup.js");

exports.vendor = function(req, res){

    if(!req.param('anchor')) { //This is first page query


        console.log("########################");
        console.log("Leading Query!!!!!!!!!");
        console.log("########################");

        async.waterfall([
            function (callback) { //Step 1: Get the user's search term
                console.log("***************************");
                console.log("Get Parameters From URL");
                console.log("***************************");
                console.log(req.query);

                var result = {};

                result.query = req.query;

                if (result.query.q !== "undefined") {

                    callback(null, res, req, result);

                } else {
                    res.send({error: "Not a valid search term"});
                }
            },
            function (res, req, result, callback) { //Step 2: Geolocate IP address using 3rd party services
                console.log("***************************");
                console.log("Geolocate user via IP");
                console.log("***************************");

                var clientIp = req.connection.remoteAddress;



                if (clientIp) {

                    var promise = new Promise(function (resolve, reject) {
                        geolocation.lookup(clientIp, function (error, response) { //Use our geolocation service
                            if (error) {

                                reject(error);

                                res.send({error: error});  //Geolocation failed

                            } else {
                                resolve(response);  //Geolocation succeeded
                            }
                        });
                    });

                    promise.then(function (locationData) {

                        result.location = JSON.parse(locationData);

                        //console.log(result.location);

                        callback(null, res, req, result);
                    });

                } else {
                    res.send({error: "Not a valid IP. Geolocation Failed"});
                }

            },
            function (res, req, result, callback) { //Get the popular categories
                console.log("***************************");
                console.log("Determine Popular Categories");
                console.log("***************************");

                var promise = new Promise(function (resolve, reject) {
                    popularCategories.fetch(result.query.q, result.location.latitude, result.location.longitude, function (error, response) { //Use our popular category service
                        if (error) {

                            reject(error);

                            res.send({error: error});  //Category Service failed

                        } else {

                            resolve(response);  //Category Service succeeded
                        }
                    });
                });


                promise.then(function (popularCategories) {

                    result.popularCategories = popularCategories;

                    callback(null, res, req, result);
                });
            },
            function (res, req, result, callback) { //Conduct search to 3Taps
                console.log("***************************");
                console.log("Get Results From 3Taps");
                console.log("***************************");

                var promise = new Promise(function (resolve, reject) {
                    vendorSearch.query(result, function (error, response) { //Use our popular category service
                        if (error) {

                            reject(error);

                            res.send({error: error});  //3Taps query failed

                        } else {

                            resolve(response);  //3Taps query succeeded
                        }
                    });
                });


                promise.then(function (externalResults) {

                    result.external = externalResults;

                    callback(null, res, req, result);
                });
            },
            function (res, req, result, callback) { //Removes duplicate ads from 3Taps results
                console.log("****************************");
                console.log("Clean Up Vendor Results UGH!");
                console.log("****************************");

                var promise = new Promise(function (resolve, reject) {
                    vendorCleanup.dedupe(result, function (error, originals) {
                        if (error) {

                            reject(error);

                            res.send({error: error});  //Failed to cleanup

                        } else {

                            resolve(originals);  //Successfully cleaned up 3taps response
                        }
                    });
                });


                promise.then(function (originals) {

                    result.external.postings = originals;

                    callback(null, res, req, result);
                });
            },
            function (res, req, result, callback) { //Conduct search to internal HashtagSell Database
                console.log("***************************");
                console.log("Search HashtagSell Mongo DB");
                console.log("***************************");

                var promise = new Promise(function (resolve, reject) {
                    internalSearch.query(req, result, function (error, response) { //Use our popular category service
                        if (error) {

                            reject(error);

                            res.send({error: error});  //HashtagSell DB query failed

                        } else {

                            resolve(response);  //HashtagSell DB query succeeded
                        }
                    });
                });


                promise.then(function (internalResults) {

                    result.merged = internalResults;

                    callback(null, res, req, result);
                });
            }
        ], function (err, res, req, result) {
            console.log("DONE WITH LEADING QUERY");
            console.log("*");
            console.log("*");
            console.log("*");
            console.log("*");
            res.send(result);
        });

    } else { //User has paginated

        console.log("########################");
        console.log("Paginated Query!!!!!!!!!");
        console.log("########################");


        async.waterfall([
            function (callback) { //Step 1: Get the user's search term
                console.log("***************************");
                console.log("Get Parameters From URL");
                console.log("***************************");
                console.log(req.query);

                var result = {};

                result.query = req.query;

                callback(null, res, req, result);

            },
            function (res, req, result, callback) { //Lookup Anchor Details
                console.log("***************************");
                console.log("Lookup Anchor Details Info");
                console.log("***************************");

                var promise = new Promise(function (resolve, reject) {
                    pagination.getAnchorDetails(result.query, function (error, anchorDetails) { //Lookup popular categories, lat & long, etc from anchor
                        if (error) {

                            console.log(error);

                            reject(error);

                            res.send({error: error});  //Anchor not found in DB

                        } else {

                            console.log(anchorDetails)

                            resolve(anchorDetails);  //Found anchor
                        }
                    });
                });


                promise.then(function (anchorDetails) {

                    result.anchorDetails = anchorDetails;

                    callback(null, res, req, result);
                });
            },
            function (res, req, result, callback) { //Conduct search to 3Taps
                console.log("***************************");
                console.log("Get Results From 3Taps");
                console.log("***************************");

                var promise = new Promise(function (resolve, reject) {
                    vendorSearch.query(result, function (error, response) { //Use our popular category service
                        if (error) {

                            reject(error);

                            res.send({error: error});  //3Taps query failed

                        } else {

                            resolve(response);  //3Taps query succeeded
                        }
                    });
                });


                promise.then(function (externalResults) {

                    result.external = externalResults;

                    callback(null, res, req, result);
                });
            },
            function (res, req, result, callback) { //Removes duplicate ads from 3Taps results
                console.log("****************************");
                console.log("Clean Up Vendor Results UGH!");
                console.log("****************************");

                var promise = new Promise(function (resolve, reject) {
                    vendorCleanup.dedupe(result, function (error, originals) {
                        if (error) {

                            reject(error);

                            res.send({error: error});  //Failed to cleanup

                        } else {

                            resolve(originals);  //Successfully cleaned up 3taps response
                        }
                    });
                });


                promise.then(function (originals) {

                    result.external.postings = originals;

                    callback(null, res, req, result);
                });
            },
            function (res, req, result, callback) { //Conduct search to internal HashtagSell Database
                console.log("***************************");
                console.log("Search HashtagSell Mongo DB");
                console.log("***************************");

                var promise = new Promise(function (resolve, reject) {
                    internalSearch.query(req, result, function (error, response) { //Use our popular category service
                        if (error) {

                            reject(error);

                            res.send({error: error});  //HashtagSell DB query failed

                        } else {

                            resolve(response);  //HashtagSell DB query succeeded
                        }
                    });
                });


                promise.then(function (internalResults) {

                    result.merged = internalResults;

                    callback(null, res, req, result);
                });
            }
        ], function (err, res, req, result) {
            console.log("DONE WITH PAGINATION");
            console.log("*");
            console.log("*");
            console.log("*");
            console.log("*");
            res.send(result);
        });


    }
};