/**
 * Created by braddavis on 2/21/15.
 */
htsApp.controller('inbox.offers.controller', ['$scope', 'mailboxFactory', function ($scope, mailboxFactory) {

    $scope.mail = mailboxFactory.mail;

    $scope.quickCache = function (offer) {
        mailboxFactory.mail.quickCache = offer;
    };

}]);