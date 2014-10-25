htsApp.controller('userpane', function($scope) {

    $scope.items = [{
        name: "My Profile",
        alerts: null,
        link: "#profile"
    },{
        name: "My Feed",
        alerts: null,
        link: "#feed"
    },{
        name: "I'm Selling",
        alerts: 2,
        link: "#selling"
    },{
        name: "I'm Interested",
        alerts: null,
        link: "#interested"
    },{
        name: "Notifications",
        alerts: 6,
        link: "#notifications"
    }];

});