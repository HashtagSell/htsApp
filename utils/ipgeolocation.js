var request = require("request");
var common   = require('../config/common.js');
var config   = common.config();
var sys = require('sys');
var exec = require('child_process').exec;

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

    if(isPrivateOrLocalIP(ip)){ //Hardcode the IP if we are running on location machine.
        //ip = "199.83.169.50"; //94043 DLA PIPER SPOOF ADDRESS
        ip = "216.38.134.18";
        //ip = "104.156.240.172";
    }

    var freeGeoIp = config.hts.geolocation_api.url + ip;

    request(freeGeoIp, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            console.log(body);

            promise(null, body);

        } else if (error) {

            console.log(error.code);

            if (error.code === "ECONNREFUSED") {


                console.log("*** FreeGeoIP Crashed!!");
                console.log("*** Starting FreeGeoIP again.");



                function puts(error, stdout, stderr) {
                    sys.puts(stdout);
                };

                exec("./startFreeGeoIpIfNotRunning.sh", puts);

                console.log('*** Waiting for 3 seconds.');

                setTimeout(function() {
                    console.log("*** Attempting Geolocation again");
                    exports.lookup(ip, promise);
                }, 3000);

            }

        } else {

            console.log(error, response, body);
        }
    });

};