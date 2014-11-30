var request = require("request");

exports.lookup = function(ip, promise){

    if(ip == "127.0.0.1"){
        ip = "216.38.134.18";
    }

    var service1 = "http://localhost:8080/json/"+ip;

    console.log(service1);

    request(service1, function (error, response, body) {

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