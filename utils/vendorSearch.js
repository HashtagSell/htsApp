var common   = require('../config/common.js');
var config   = common.config();

exports.query = function(result, promise){

    //Instantiate Josh's 3Taps wrapper.  Pass in API key from global env variable.
    var threeTapsClient = require('3taps')({ apikey : config.THREE_TAPS_KEY, strictSSL : false });

    //Anchor details have already been looked up in mongo store.

    if(!result.anchorDetails) {  //If we do not have anchor then this is first query

        result.vendorFormattedCategories = prepareCategories(result.popularCategories);
        result.query.source = "CRAIG|EBAYM|BKPGE|AUTOD|E_BAY";
        result.query.sort = "distance";
        result.query.retvals = "heading,price,body,external_url,category,category_group,images,location,external_id,annotations,source";
        result.query.rpp = "35";

        var options = {
            category        : result.vendorFormattedCategories,
            heading         : result.query.q,
            lat             : result.location.latitude,
            long            : result.location.longitude,
            retvals         : result.query.retvals,
            rpp             : result.query.rpp,
            sort            : result.query.sort,
            source          : result.query.source
        };

    } else {  //This is paginated query and anchor details were recovered from mongo store

        result.location = {};
        result.location.latitude = result.anchorDetails.lat;
        result.location.longitude = result.anchorDetails.lon;
        result.query.source = result.anchorDetails.source;
        result.query.sort = result.anchorDetails.sort;
        result.query.retvals = result.anchorDetails.retvals;
        result.query.rpp = result.anchorDetails.rpp;
        result.popularCategories = result.anchorDetails.category;
        result.vendorFormattedCategories = prepareCategories(result.popularCategories);

        var options = {
            anchor          : result.anchorDetails.anchor,
            category        : result.vendorFormattedCategories,
            heading         : result.query.q,
            lat             : result.location.latitude,
            long            : result.location.longitude,
            page            : result.anchorDetails.next_page,
            retvals         : result.query.retvals,
            rpp             : result.query.rpp,
            sort            : result.query.sort,
            source          : result.query.source
        };
    }

    //Search 3Taps!
    threeTapsClient.search(options, function (err, data) {
        if(!err){
            promise(null, data);
            console.log(data);
        } else {
            promise(err, null);
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