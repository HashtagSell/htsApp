var htsApp = angular.module('htsApp', ['ngRoute', 'ui.bootstrap', 'mentio', 'iso.directives', 'ui.bootstrap-slider', 'infinite-scroll', 'angular-images-loaded', 'ngTable']);



htsApp.directive('userMenu', function(){
    return {
        templateUrl: 'userMenu/partials/usermenu.html'
    };
});


htsApp.directive('awesomeBar', function(){
    return {
        templateUrl: 'awesomeBar/partials/awesomeBar.html'
    };
});



//Verifies is password field match
htsApp.directive('match', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            match: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
});