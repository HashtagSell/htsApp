var request = require("request");

exports.lookup = function(ip, promise){

    var isPrivateOrLocalIP = function (ip) {
        var parts = ip.split('.');
        if (parts[0] === '10' ||
            (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) ||
            (parts[0] === '192' && parts[1] === 168)) {
            return true;
        } else if (ip === "127.0.0.1") {
            return true;
        }
        return false;
    };

    if(isPrivateOrLocalIP(ip)){
        ip = "216.38.134.18";
    }

    var freeGeoIp = "http://localhost:8080/json/"+ip;

    request(freeGeoIp, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            console.log(body);

            promise(null, body);

        } else if (error) {

            console.log(error);

            promise(error, null);

        } else {

            console.log("Fell into else.");

            console.log(error, response, body);
        }
    });

};