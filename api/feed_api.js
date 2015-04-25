/**
 * Created by braddavis on 12/15/14.
 */
var async = require('async');
var Promise = require('promise');
var geolocation = require("../utils/ipgeolocation.js");
var vendorSearch = require("../utils/vendorSearch.js");
var vendorCleanup = require("../utils/vendorCleanup.js");
var CityCodeModel = require("../config/database/models/3TapsCityCode.js");

exports.poll = function(req, res){

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

                callback(null, res, req, result);

            },
            function (res, req, result, callback) { //Step 2: Geolocate IP address using 3rd party services
                console.log("***************************");
                console.log("Geolocate user via IP");
                console.log("***************************");

                var clientIp = req.connection.remoteAddress;

                if (clientIp) {

                    var promise = new Promise(function (resolve, reject) {
                        geolocation.lookup(clientIp, function (err, response) { //Use our geolocation service
                            if (err) {

                                reject(err);

                                res.send({error: err});  //Geolocation failed

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
                console.log("Get Relevant 3taps Location Data");
                console.log("***************************");

                var cityCommaState = result.location.city + ', ' + result.location.region_code;

                //Convert San Francisco, CA into USA-SFO_SNF 3Taps city code by looking up in database
                CityCodeModel.findOne({ 'full_name': cityCommaState }, function (err, cityMetadata) {

                    if (err) {
                        res.send({error: err});

                    } else if (!cityMetadata) {

                        res.send({error: cityCommaState + 'not found'});

                    } else if (cityMetadata) {

                        result.location.cityCode = cityMetadata.code;
                        console.log(cityCommaState + ' metro-code is ->>>> ' + result.location.cityCode);
                        callback(null, res, req, result);

                    }
                });

            },
            function (res, req, result, callback) { //Conduct search to 3Taps
                console.log("***************************");
                console.log("Get Results From 3Taps");
                console.log("***************************");

                var promise = new Promise(function (resolve, reject) {
                    vendorSearch.poll(result, function (err, response) { //Use our popular category service
                        if (err) {

                            reject(err);

                            res.send({error: err});  //3Taps query failed

                        } else {

                            resolve(response);  //3Taps query succeeded
                        }
                    });
                });


                promise.then(function (externalResults) {

                    result.external = externalResults;

                    console.log('Number of items in results: ', result.external.postings.length);

                    if (result.external.postings.length) {
                        callback(null, res, req, result);

                    } else {

                        res.send(result);

                    }
                });
            },
            function (res, req, result, callback) { //Removes duplicate ads from 3Taps results
                console.log("****************************");
                console.log("Clean Up Vendor Results UGH!");
                console.log("****************************");

                var promise = new Promise(function (resolve, reject) {
                    vendorCleanup.dedupe(result, function (err, originals) {
                        if (err) {

                            reject(err);

                            res.send({error: err});  //Failed to cleanup

                        } else {

                            resolve(originals);  //Successfully cleaned up 3taps response
                        }
                    });
                });


                promise.then(function (originals) {

                    result.external.postings = originals;

                    callback(null, res, req, result);
                });
            }
        ], function (err, res, req, result) {
            res.send(result);
            console.log("DONE WITH LEADING QUERY");
            console.log("*");
            console.log("*");
            console.log("*");
            console.log("*");
        });

    } else { //User has paginated

        console.log("########################");
        console.log("Paginated Query!!!!!!!!!");
        console.log("########################");


        async.waterfall([
            function (callback) { //Step 1: Get the user's search term
                console.log("***************************");
                console.log("Get Paginated Parameters From URL");
                console.log("***************************");
                console.log(req.query);

                var result = {};

                result.query = req.query;

                callback(null, res, req, result);

            },
            function (res, req, result, callback) { //Conduct search to 3Taps
                console.log("***************************");
                console.log("Get Paginated Results From 3Taps");
                console.log("***************************");

                var promise = new Promise(function (resolve, reject) {
                    vendorSearch.poll(result, function (err, response) { //Use our popular category service
                        if (err) {

                            reject(err);

                            res.send({error: err});  //3Taps query failed

                        } else {

                            resolve(response);  //3Taps query succeeded
                        }
                    });
                });


                promise.then(function (externalResults) {

                    result.external = externalResults;

                    console.log('Number of items in results: ', result.external.postings.length);

                    if (result.external.postings.length) {

                        callback(null, res, req, result);

                    } else {

                        res.send(result);

                    }
                });
            },
            function (res, req, result, callback) { //Removes duplicate ads from 3Taps results
                console.log("****************************");
                console.log("Clean Up Paginated Vendor Results UGH!");
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
            }
        ], function (err, res, req, result) {
            res.send(result);
            console.log("DONE WITH PAGINATION");
            console.log("*");
            console.log("*");
            console.log("*");
            console.log("*");
        });


    }
};