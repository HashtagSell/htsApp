var request = require("request");
var path = require('path');

exports.locationMetadata = function(req, res){

    if(req.query.level == "city") {  //Take in city name and lookup 3taps for for the matching city name

        var CityCodeModel = require("../config/database/models/3TapsCityCode.js");

        var cityCommaState = req.query.city;

        console.log(cityCommaState);

        //Search our users collection by the username and update their user_settings object
        CityCodeModel.findOne({ 'full_name': cityCommaState }, function (err, cityMetadata) {

            //systematic error. Redirect to page so user can report error.
            if (err) {
                console.log("error");
                res.json({error : err});

                // if no user is found, then this is a bad activation id
            } else if (!cityMetadata) {

                console.log("city not found");
                res.json({error : "city not found"});

                // found user that needs activation
            } else if (cityMetadata) {

                res.send({success:true, metadata: cityMetadata});

            }
        });

    } else if(req.query.level == "state"){
        res.send({success:false, metadata: "Coming soon"});
    } else {
        res.send({success:false, metadata: "See Documentation"});
    }

};


exports.categoryMetadata = function(req, res){

    var categoryCode = req.query.categoryCode;

    var CategoryModel = require("../config/database/models/3TapsCategory.js");

    //Search our users collection by the username and update their user_settings object
    CategoryModel.findOne({ 'code': categoryCode }, function (err, codeMetaData) {

        //systematic error. Redirect to page so user can report error.
        if (err) {
            console.log("error");
            res.json({error : err});

            // if no user is found, then this is a bad activation id
        } else if (!codeMetaData) {

            console.log("category not found");
            res.json({error : "category not found"});

            // found user that needs activation
        } else if (codeMetaData) {

            res.send({success:true, metadata: codeMetaData});

        }
    });

};




exports.getAllCategories = function(req, res){

    var CategoryModel = require("../config/database/models/3TapsCategory.js");

    //Search our users collection by the username and update their user_settings object
    CategoryModel.find({}, function (err, categories) {

        //systematic error. Redirect to page so user can report error.
        if (err) {
            console.log("error");
            res.json({error : err});

            // if no user is found, then this is a bad activation id
        } else if (!categories) {

            console.log("category not found");
            res.json({error : "category not found"});

            // found user that needs activation
        } else if (categories) {

            res.send({success:true, categories: categories});

        }
    });

};