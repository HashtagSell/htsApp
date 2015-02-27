/**
 * Created by braddavis on 2/21/15.
 */
htsApp.controller('mailbox.controller', ['$scope', 'mailboxFactory', function ($scope, mailboxFactory) {

    $scope.cabinet = mailboxFactory.cabinet;

}]);