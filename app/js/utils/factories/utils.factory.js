/**
 * Created by braddavis on 2/16/15.
 */
htsApp.factory('utilsFactory', ['ENV', function (ENV) {

    var factory = {};

    factory.bracketNotationURL = function (params, bracketURL) {

        for (var prop in params) {

            if(!bracketURL) {
                bracketURL = '?'+prop;
            } else {
                bracketURL += '[' + prop + ']';
            }

            if (typeof params[prop] === "object" && params[prop] !== null) {

                return factory.bracketNotationURL(params[prop], bracketURL);

            } else {

                bracketURL += '=' + params[prop];

                return bracketURL;
            }
        }

    };


    return factory;
}]);