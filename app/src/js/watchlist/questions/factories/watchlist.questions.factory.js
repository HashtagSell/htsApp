/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('watchlistQuestionsFactory', ['$http', '$rootScope', 'ENV', '$q', 'utilsFactory', function ($http, $rootScope, ENV, $q, utilsFactory) {
    var factory = {};

    //Splash controller binds with this object to update view in realtime.
    factory.questions = {
        store: []
    };



    factory.getPostingIdQuestions = function (postingId) {

        var deferred = $q.defer();

        var params = {
            postingId: postingId,
            questions: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            if(response.status === 200) {

                factory.questions.store = response.data.questions.results; //SplashFactory watches this store.

                deferred.resolve(response);

            } else {
                deferred.reject(response);
            }

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };


    factory.submitQuestion = function (question, post, username) {

        var deferred = $q.defer();

        var postingId = post.postingId;

        var data = {
            "username": username,
            "value" : question
        };

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + '/questions',
            data: data
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.deleteQuestion = function (postingId, questionId) {

        //mailboxFactory.mail.questions.sent.data = [];
        //mailboxFactory.mail.questions.received.data = [];

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };


    factory.deleteAnswer = function (postingId, questionId, answerId) {

        //mailboxFactory.mail.questions.sent.data = [];
        //mailboxFactory.mail.questions.received.data = [];

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId + '/answers/ ' + answerId
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    return factory;
}]);