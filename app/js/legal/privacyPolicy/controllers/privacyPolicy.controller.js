/**
 * Created by braddavis on 5/18/15.
 */
htsApp.controller('privacyPolicyController', ['$scope', 'ENV', function($scope, ENV) {

    $scope.legalUrl = {
        privacyPolicy: ENV.htsAppUrl + '/privacy-policy',
        postingRules: ENV.htsAppUrl + '/posting-rules',
        betaAgreement: ENV.htsAppUrl + '/beta-agreement',
        termsOfServiceUrl: ENV.htsAppUrl + '/terms-of-service'
    };

}]);