/**
 * Created by braddavis on 2/16/15.
 */

htsApp.factory('utilsFactory', ['ENV', function (ENV) {

    var factory = {};

    //Converts objects to bracket notation string.
    factory.bracketNotationURL = function (params, bracketURL, urlParts) {

        urlParts = urlParts || [];
        var index = 0;

        for (var prop in params) {

            index++;
            //console.log('index Counter: ',index);

            if(params.hasOwnProperty(prop)) {

                //console.log('prop: ', prop);
                //console.log('parms[prop]: ', params[prop]);
                //console.log('urlParts.length:', urlParts.length);
                //console.log('bracketURL Before: ', bracketURL);

                if (!bracketURL && !urlParts.length) {
                    bracketURL = '?' + prop;
                } else if (index > 1 && urlParts.length && bracketURL.indexOf('[')===-1) {
                    bracketURL = '&' + prop;
                } else if (index > 1 && urlParts.length && bracketURL.indexOf('[')!==-1) {
                    bracketURL = bracketURL.replace(/\[(.+?)\]/g, "["+prop+"]");
                } else {
                    bracketURL += '[' + prop + ']';
                }

                //console.log('bracketURL After: ', bracketURL);


                if (typeof params[prop] === "object" && params[prop] !== null && params[prop].constructor !== Array) {

                    //console.log('RECURSING!');
                    //console.log('~~~~~~~~~~~~~~~~~~~');

                    factory.bracketNotationURL(params[prop], bracketURL, urlParts);

                } else {

                    var finalBracketURL = bracketURL;

                    if(params[prop].constructor === Array) {
                        finalBracketURL += '=' + params[prop].join();
                    } else {
                        finalBracketURL += '=' + params[prop];
                    }

                    urlParts.push(finalBracketURL);

                    //console.log(urlParts);
                    //console.log('~~~~~~~~~~~~~~~~~~~');

                }
            }
        }

        return urlParts.join('');

    };


    return factory;
}]);