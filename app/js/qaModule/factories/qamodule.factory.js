/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('qaFactory', ['$http', '$rootScope', 'ENV', 'mailboxFactory', 'Session', '$q', function ($http, $rootScope, ENV, mailboxFactory, Session, $q) {
    var factory = {};

    //Splash controller binds with this object to update view in realtime.
    factory.questions = {
        store: []
    };


    //Socket.io calls this function when new-question is emitted
    factory.notifySellerOfNewQuestion = function (question) {

        mailboxFactory.mail.questions.sent.data = [];
        mailboxFactory.mail.questions.received.data = [];

        console.log(
            '%s asked a question on postingId %s : "%s"',
            question.username,
            question.postingId,
            question.question.value
        );

        $rootScope.$apply(function () {
            factory.getAllQuestions(factory.allUserItemsForSale);
        });
    };




    factory.getPostingIdQuestions = function (postingId) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + '/questions'
        }).then(function (response, status, headers, config) {

            factory.questions.store = response.data.results;

            console.log('factory.questions.store', factory.questions.store);

            factory.parseAllQuestions(factory.questions.store).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });


        }, function (err, status, headers, config) {

            console.log(err);

            deferred.reject(err);

        });

        return deferred.promise;

    };


    factory.getAllQuestions = function (allUserItemsForSale) {

        factory.allUserItemsForSale = allUserItemsForSale;

        console.log(allUserItemsForSale);

        mailboxFactory.mail.questions.received.data = [];

        for(var i=0; i < allUserItemsForSale.length; i++) { //Loop though all the users items for sale and append offer to matching item

            var item = allUserItemsForSale[i];

            $http({
                method: 'GET',
                url: ENV.postingAPI + item.postingId + '/questions'
            }).then(function (response, status, headers, config) {

                //mailboxFactory.mail.questions.received.unread = mailboxFactory.mail.questions.received.unread.concat(response.data.results);

                //console.log(response);

                factory.parseAllQuestions(response.data.results).then(function (response) {

                    mailboxFactory.mail.totalUnread();

                }, function (err) {

                    alert('failed to get all questions');

                });




            }, function (err, status, headers, config) {

                console.log(err);

            });

        }

    };



    factory.getSingleQuestion = function(postingId, questionId) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + '/questions/' + questionId
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);
        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;


    };


    factory.parseAllQuestions = function (allQuestions) {

        var deferred = $q.defer();

        var questionsSent = [];

        var questionsReceived = [];

        for(var i=0; i < allQuestions.length; i++ ){
            var question = allQuestions[i];

            if(question.username === Session.userObj.user_settings.name) {
                questionsSent.push(question);
            } else {
                questionsReceived.push(question);
            }
        }

        mailboxFactory.mail.questions.sent.data = mailboxFactory.mail.questions.sent.data.concat(questionsSent);
        mailboxFactory.mail.questions.received.data = mailboxFactory.mail.questions.received.data.concat(questionsReceived);

        mailboxFactory.mail.totalUnread();

        console.log(mailboxFactory.mail);

        deferred.resolve(true);

        return deferred.promise;

    };




    factory.submitQuestion = function (question, postingId, username) {

        mailboxFactory.mail.questions.sent.data = [];
        mailboxFactory.mail.questions.received.data = [];

        var deferred = $q.defer();

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



    factory.submitAnswer = function (postingId, questionId, payload) {

        mailboxFactory.mail.questions.sent.data = [];
        mailboxFactory.mail.questions.received.data = [];

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + '/questions/' + questionId + '/answers',
            data: payload
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

        mailboxFactory.mail.questions.sent.data = [];
        mailboxFactory.mail.questions.received.data = [];

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

        mailboxFactory.mail.questions.sent.data = [];
        mailboxFactory.mail.questions.received.data = [];

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