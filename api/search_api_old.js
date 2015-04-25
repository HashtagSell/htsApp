var request = require("request");
var path = require('path');


exports.vendor = function(req, res){
	
	var three_taps_api = "http://search.3taps.com";
	var auth_token = "&auth_token=f2862071ede0bbd93bee4f091c522a9e";
	var hts_app_query = req._parsedUrl.search;
	var cat_query = three_taps_api+hts_app_query+auth_token;

	
	request(cat_query, function(error, response, body) {
	    if (!error && response.statusCode == 200) {

            res.send(body);

        } else if(error){
            res.send(response);
        }
	});
};