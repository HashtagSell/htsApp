var request = require("request");
var path = require('path');


exports.query = function(result, promise){



    var three_taps_api = "http://search.3taps.com";
    var auth_token = "?auth_token=f2862071ede0bbd93bee4f091c522a9e";
    var heading = "&heading=" + result.query.q;


    if(!result.anchorDetails) {

        result.vendorFormattedCategories = prepareCategories(result.popularCategories);
        result.query.source = "CRAIG|EBAYM|BKPGE|AUTOD|E_BAY";
        result.query.sort = "distance";
        result.query.retvals = "heading,price,body,external_url,category,category_group,images,location,external_id,annotations,source";
        result.query.rpp = "35";

        var lat = "&lat=" + result.location.latitude;
        var lon = "&long=" + result.location.longitude;
        var categories = "&category=" + result.vendorFormattedCategories;
        var source = "&source=" + result.query.source;
        var sort = "&sort=" + result.query.sort;
        var retvals = "&retvals=" + result.query.retvals;
        var rpp = "&rpp=" + result.query.rpp;

        //http://search.3taps.com?source=CRAIG|EBAYM|BKPGE|AUTOD|E_BAY|EBAYM&rpp=15&heading=tires&lat=37.3541&long=-121.9552&category=VPAR|~PPPP|~PMSM|~PMSW|~PWSM|~PWSW|~POTH|~MMMM|~MESC|~MFET|~MJOB|~MMSG|~MPNW|~MSTR|~MOTH&sort=distance&retvals=heading,price,body,external_url,category,category_group,images,location,external_id,annotations,source
        var concatURL = three_taps_api + auth_token + source + heading + lat + lon + categories + sort + retvals + rpp;

    } else {
        console.log("paginated");

        result.location = {};
        result.location.latitude = result.anchorDetails.lat;
        result.location.longitude = result.anchorDetails.lon;
        result.query.source = result.anchorDetails.source;
        result.query.sort = result.anchorDetails.sort;
        result.query.retvals = result.anchorDetails.retvals;
        result.query.rpp = result.anchorDetails.rpp;
        result.popularCategories = result.anchorDetails.category;
        result.vendorFormattedCategories = prepareCategories(result.popularCategories);

        console.log(result.location.latitude, result.location.longitude);

        var lat = "&lat=" + result.location.latitude;
        var lon = "&long=" + result.location.longitude;
        var categories = "&category=" + result.vendorFormattedCategories;
        var source = "&source=" + result.query.source;
        var sort = "&sort=" + result.query.sort;
        var rpp = "&rpp=" + result.query.rpp;
        var retvals = "&retvals=" + result.query.retvals;
        var anchor = "&anchor=" + result.anchorDetails.anchor;
        var page = "&page=" + result.anchorDetails.next_page;

        var concatURL = three_taps_api + auth_token + source + heading + lat + lon + categories + sort + retvals + rpp + anchor + page;

    }

    console.log(concatURL);

    request(concatURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var results = JSON.parse(body);

            promise(null, results);

        } else if (error) {

            console.log(error);

            promise(error, null);

        }
    });
};


function prepareCategories(categories) {

    var vendorCategoryString = '';

    for(var i = 0; i < categories.length; i++){
        var categoryCode = categories[i].category;
        if(i != categories.length-1) {
            vendorCategoryString += categoryCode + "|";
        } else {
            vendorCategoryString += categoryCode;
        }
    }

    return vendorCategoryString;
}