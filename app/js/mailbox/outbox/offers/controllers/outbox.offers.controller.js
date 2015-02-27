/**
 * Created by braddavis on 2/21/15.
 */
htsApp.controller('outbox.offers.controller', ['$scope', 'mailboxFactory', function ($scope, mailboxFactory) {

    $scope.mail = mailboxFactory.mail;

}]);