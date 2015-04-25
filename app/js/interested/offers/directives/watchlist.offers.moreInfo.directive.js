/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("senderOffersMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/interested/offers/partials/watchlist.offers.html",
        controller: "watchlist.offers.controller"
    };
});