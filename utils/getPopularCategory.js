var request = require("request");
var HashTable = require('hashtable');


//TODO: Convert this to 3Tap API Wrapper
exports.fetch = function(term, lat, lon, promise){

    var three_taps_api = "http://search.3taps.com";
    var auth_token = "?auth_token=f2862071ede0bbd93bee4f091c522a9e";
    var source = "&source=CRAIG|EBAYM|BKPGE|AUTOD|E_BAY|EBAYM";
    var heading = "&heading=" + term;
    var lat = "&lat=" + lat;
    var lon = "&long=" + lon;
    var sort = "&sort=distance";
    var retvals = "&retvals=category";
    var rpp = "&rpp=99";

    var concatURL = three_taps_api + auth_token + source + heading + lat + lon + sort + retvals + rpp;

    console.log(concatURL);

    request(concatURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var categories = JSON.parse(body);

            weighCategories(categories, function (popularCategories) {

                console.log(popularCategories);
                promise(null, popularCategories);
            });

        } else if (error) {

            console.log(error);

            promise(error, null);

        }
    });

};



function weighCategories(categories, callback){

    //Calculate popular categories
    var results = categories.postings;
    var loopCounter = 0;

    var catHashTable = new HashTable();


    if (results) {

        var numOfCategoryResults = results.length;

        for (var j = 0; j < numOfCategoryResults; j++) {

            var categoryCode = results[j].category;

            loopCounter++;

            //Tally how many times each category of items is returned
            var count = catHashTable.get(categoryCode);
            if (count) {
                catHashTable.remove(categoryCode);
                var increment = count+1;
                catHashTable.put(categoryCode, increment);
            } else {
                catHashTable.put(categoryCode, 1);
            }
        }


        //Divide number of unique categories by number of results to calculate our popular cateogry
        console.log("number of unique categories: ", catHashTable.size(), "& number of total results: ", loopCounter);
        var avgWeight = Math.abs(loopCounter / catHashTable.size());
        console.log("Our avg weight for a winning category is: ", avgWeight);

        var popularCategories = [];
        var totalAvgWeight = 0;
        var loopCounter = 0;
        catHashTable.forEach(function (key, count) {

            if(count < avgWeight){
                catHashTable.remove(key);
                console.log(key, " was found ", count, "times. Removing cause less than", avgWeight);
            } else {
                popularCategories.push({category:key});
                totalAvgWeight = totalAvgWeight + count;
                loopCounter++
            }
        });

        callback(popularCategories);
    }


}