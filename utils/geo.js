var request = require("request");
var common   = require('../config/common.js');
var config   = common.config();
var async = require('async');
var Promise = require('promise');
var sys = require('sys');
var exec = require('child_process').exec;
var CityCodeModel = require("../config/database/models/3TapsCityCode.js");
var util = require('util');


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


};


exports.geolocateIp = function(req, res){

    async.waterfall([
        function (callback) { //Step 1: Get the user's search term
            console.log("***************************");
            console.log("Check if private IP");
            console.log("***************************");

            var originIp = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            if(originIp) {

                var result = {
                    clientIp: originIp
                };

                var spoofedIp = "216.38.134.18";

                var parts = result.clientIp.split('.');

                if (parts[0] === '10' ||
                    (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) ||
                    (parts[0] === '192' && parts[1] === 168) ||
                    (result.clientIp === "127.0.0.1")) {

                    result.clientIp = spoofedIp;
                    result.spoofed = true;
                } else {
                    result.spoofed = false;
                }

                callback(null, res, req, result);
            } else {

                var err = {
                    message: "IP missing from request header"
                };

                callback(err, res, req);

            }

        },
        function (res, req, result, callback) { //Step 2: Geolocate IP address using 3rd party services
            console.log("***************************");
            console.log("Geolocate user via IP");
            console.log("***************************");


            request(config.hts.geolocation_api.url + result.clientIp, function (error, response, body) {

                if (!error && response.statusCode === 200) {

                    result.freeGeoIp = JSON.parse(body);

                    callback(null, res, req, result);

                } else if (error) {

                    console.log(error.code);

                    if (error.code === "ECONNREFUSED") {


                        console.log("*** FreeGeoIP Crashed!!");
                        console.log("*** Starting FreeGeoIP again.");

                        function puts(error, stdout, stderr) {
                            sys.puts(stdout);
                        };

                        exec("./startFreeGeoIpIfNotRunning.sh", puts);

                        console.log('*** Waiting for 3 seconds.');

                        setTimeout(function () {
                            console.log("*** Attempting Geolocation again");
                            exports.geolocateIp(req, res);
                        }, 3000);

                    } else {
                        console.log(error, response, body);

                        var err = {
                            message: "FreeGeoIp has crashed",
                            error: error
                        };

                        callback(err, res, req);

                    }

                } else {

                    var err = {
                        message: "FreeGeoIp HTTP response not 200",
                        error: response.statusCode
                    };

                    callback(err, res, req);
                }
            });

        },
        function (res, req, result, callback) { //Get the popular categories
            console.log("***************************");
            console.log("Get Relevant 3taps Location Data");
            console.log("***************************");

            var cityCommaState = result.freeGeoIp.city + ', ' + result.freeGeoIp.region_code;

            //Convert San Francisco, CA into USA-SFO_SNF 3Taps city code by looking up in database
            CityCodeModel.findOne({ 'full_name': cityCommaState }, function (err, cityMetadata) {

                if (err) {

                    var err = {
                        message: "Failed to lookup city code from db",
                        error: err
                    };

                    callback(err, res, req);

                } else if (!cityMetadata) {

                    res.send({error: cityCommaState + 'not found'});


                    var err = {
                        message: cityCommaState + 'not found'
                    };

                    callback(err, res, req);

                } else if (cityMetadata) {

                    result.cityCode = cityMetadata;
                    callback(null, res, req, result);

                }
            });

        }
    ], function (err, res, req, result) {
        if(!err) {
            res.send(result);
            console.log("DONE WITH IP GEOLOCATION");
            console.log("*");
            console.log("*");
            console.log("*");
            console.log("*");
        } else {
            res.send(err);
        }
    });
};