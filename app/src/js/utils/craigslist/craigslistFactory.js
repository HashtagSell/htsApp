/**
 * Created by braddavis on 10/30/15.
 */
htsApp.factory('craigslistFactory', ['$q', '$http', '$window', 'ENV', function ($q, $http, $window, ENV) {

    var factory = {};


    //factory.checkForExtension = function (extensionId, requiredVersion, post) {
    //
    //    var deferred = $q.defer();
    //
    //    var message;
    //
    //    var isOpera = !!$window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    //    var isChrome = !!$window.chrome && !isOpera;
    //
    //    if (!isChrome) {
    //
    //        message = "Sorry, Craigslist publishing only works in Chrome at this time. :(  Install Chrome?";
    //        deferred.reject(message);
    //        return deferred.promise;
    //    }
    //
    //    if(post.location.country !== 'USA' && post.location.state !== 'CA') {
    //
    //        message = "Sorry we can only publish to Craigslist in California during this time.";
    //        deferred.reject(message);
    //        return deferred.promise;
    //    }
    //
    //    chrome.runtime.sendMessage(extensionId, { message: "version" }, function (versionResponse) {
    //
    //        if (versionResponse === undefined || versionResponse === null) {
    //
    //            message = "Please install the HashtagSell extension";
    //            deferred.reject(message);
    //        }
    //
    //        if (parseFloat(versionResponse) < parseFloat(requiredVersion)) {
    //
    //            message = "Please update the HashtagSell extension";
    //            deferred.reject(message);
    //        }
    //
    //
    //        deferred.resolve();
    //    });
    //
    //    return deferred.promise;
    //};



    factory.publishToCraigslist = function (newPost) {

        var deferred = $q.defer();

        chrome.runtime.sendMessage(ENV.extensionId, { cmd: "kickstart", data: newPost }, function (response) {
            console.log(response);
        });


        deferred.resolve();

        return deferred.promise;
    };


    return factory;

}]);