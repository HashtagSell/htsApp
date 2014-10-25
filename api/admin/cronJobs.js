var request = require("request");
var path = require('path');
var mongoose = require('mongoose');
var auth_token = "?auth_token=f2862071ede0bbd93bee4f091c522a9e";

exports.updateLocations = function(req, res){

    var three_taps_api = "http://reference.3taps.com/locations";

    if(req.query.level == "city") {

        var CityCodeModel = require("../../models/3TapsCityCode.js");

        var cat_query = three_taps_api + auth_token + '&level='+req.query.level;

        console.log(cat_query);

        request(cat_query, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var response = JSON.parse(response.body);

                var inserts_completed = 0;
                var droppedTable = null;

                //Drop the city_code collection cause we're going to update it.
                mongoose.connections[0].db.dropCollection("city_codes", function(err, result) {
                    if(err){
                        res.send({success:false, error:err});
                    }
                    droppedTable = result;
                });

                for (var i = 0; i <= response.locations.length; i++) {

                    var city = new CityCodeModel(response.locations[i]);

                    city.save(function (err) {
                        if (err) {
                            res.send({success: false, error:err});
                        }
                        else {
                            //some logic goes here
                            inserts_completed++;
                            if (inserts_completed == response.locations.length) {
                                finallyDone(inserts_completed);
                            }
                        }
                    })



                }

                finallyDone = function (inserts_completed) {
                    res.send({success: true, inserted_items:inserts_completed, dropped_table: droppedTable});
                }

            } else if (error) {
                res.send({success: false, error: error});
            }
        });
    } else if (req.query.level == "state"){
        res.send({success: false, error: "That level has not been built yet"});
    } else {
        res.send({success:false, error: "See Documentation"});
    }

};



exports.updateCategories = function(req, res){

    var categoryModel = require("../../models/3tapsCategory.js");

    var three_taps_api = "http://reference.3taps.com/categories";

    var cat_query = three_taps_api + auth_token;

    request(cat_query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var response = JSON.parse(response.body);

            var inserts_completed = 0;
            var droppedTable = null;

            //Drop the city_code collection cause we're going to update it.
            mongoose.connections[0].db.dropCollection("product_categories", function(err, result) {
                if(err){
                    res.send({success:false, error:err});
                }
                droppedTable = result;
            });

            for (var i = 0; i <= response.categories.length; i++) {

                var category = new categoryModel(response.categories[i]);

                category.save(function (err) {

                    if (err) {
                        console.log(err);
                        res.send({success:false, error:err});
                    }
                    else {
                        //some logic goes here
                        inserts_completed++;
//                        console.log("inserts_completed: "+inserts_completed);
                        if (inserts_completed == response.categories.length) {
                            finallyDone(inserts_completed);
                        }
                    }
                })
            }

            finallyDone = function (inserts_completed) {
                res.send({success: true, inserted_items:inserts_completed, dropped_table: droppedTable});
            }

        } else if (error) {
            res.send({success: false, error: error});
        }
    });

};