/**
 * Created by braddavis on 2/21/15.
 */
htsApp.controller('inbox.questions.controller', ['$scope', 'mailboxFactory', function ($scope, mailboxFactory) {

    $scope.mail = mailboxFactory.mail;

    $scope.quickCache = function (question) {
        mailboxFactory.mail.quickCache = question;
    };

}]);