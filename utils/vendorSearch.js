var common   = require('../config/common.js');
var config   = common.config();
var threeTapsClient = require('3taps')({ apikey : config.THREE_TAPS_KEY, strictSSL : false });

exports.query = function(result, promise){

    if(!result.anchorDetails) {  //If we do not have anchor then this is first query

        result.vendorFormattedCategories = prepareCategories(result.popularCategories);
        result.query.source = config.THREE_TAPS_DEFAULT_SOURCES;
        result.query.sort = config.THREE_TAPS_DEFAULT_SORT;
        result.query.retvals = config.THREE_TAPS_DEFAULT_RETVALS;
        result.query.rpp = config.THREE_TAPS_DEFAULT_RPP;

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

    } else {  //This is paginated query and anchor details were recovered from Mongo analytics collection

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


//Converts [{category:RRRR},{category:SSSS}] to 'RRRR|SSSS'
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
};




exports.poll = function(result, promise){

    if(!result.query.anchor) {  //If we do not have an anchor then this is first query

        //Generate anchor from 5 min ago
        var anchorDate = new Date();
        anchorDate.setMinutes(anchorDate.getMinutes() - 5);


        threeTapsClient.anchor({
            timestamp : anchorDate
        }, function (err, data) {

            //Store our starting anchor that 3Taps handed back
            result.anchor = data.anchor;

            //Get categories from param in GET request
            result.vendorFormattedCategories = result.query.categories;

            //Use our default 3Taps parameters
            result.source = config.THREE_TAPS_DEFAULT_SOURCES;
            result.retvals = config.THREE_TAPS_DEFAULT_RETVALS;

            var options = {
                anchor          : result.anchor,
                category_group  : result.vendorFormattedCategories,
                'location.city' : result.location.cityCode,
                retvals         : result.retvals,
                source          : result.source
            };

            console.log('Options passed into polling API call');
            console.log(options);

            //Search 3Taps polling API
            threeTapsClient.poll(options, function (err, data) {
                if(!err){
                    promise(null, data);

                } else {
                    promise(err, null);
                }
            });


        });

    } else {  //This is paginated query and anchor details were recovered from mongo store

        result.anchor = result.query.anchor;
        result.location = {};
        result.location.cityCode = result.query.cityCode;
        result.vendorFormattedCategories = result.query.categories;
        result.source = config.THREE_TAPS_DEFAULT_SOURCES;
        result.retvals = config.THREE_TAPS_DEFAULT_RETVALS;

        var options = {
            anchor          : result.anchor,
            category_group  : result.vendorFormattedCategories,
            'location.city' : result.location.cityCode,
            retvals         : result.retvals,
            source          : result.source
        };

        console.log('Options passed into polling API call');
        console.log(options);

        threeTapsClient.poll(options, function (err, data) {
            if(!err){
                promise(null, data);

            } else {
                promise(err, null);
            }
        });

    }

};