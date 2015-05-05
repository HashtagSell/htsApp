//TODO: DELETE ME

var request = require("request");
var path = require('path');

var CategoryModel = require("../config/database/models/3tapsCategory.js");


exports.categoryMetadata = function(req, res){

    var categoryCode = req.query.categoryCode;

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