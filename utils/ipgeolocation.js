var request = require("request");

exports.lookup = function(ip, promise){

    if(ip == "127.0.0.1"){
        ip = "76.21.93.50";
    };

    var service1 = "http://freegeoip.net/json/"+ip;


    request(service1, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            promise(null, body);

        } else if (error) {

            promise(error, null);

        }
    });

};