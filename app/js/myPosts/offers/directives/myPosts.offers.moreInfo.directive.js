/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("ownerOffersMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/myPosts/offers/partials/myPosts.offers.html",
        controller: "myPosts.offers.controller"
    };
});