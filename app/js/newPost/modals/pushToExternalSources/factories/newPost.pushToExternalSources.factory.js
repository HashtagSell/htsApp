/**
 * Created by braddavis on 2/27/15.
 */
htsApp.factory('externalSourcesSelection', ['$http', function ($http) {
    var factory = {};

    //factory.sources = {
    //    marketplaces: [
    //        {"name": "eBay", "icon": "<i class='fa fa-facebook-square'></i>", selected: false},
    //        {"name": "Amazon", "icon": "<i class='fa fa-facebook-square'></i>", selected: false},
    //        {"name": "Craigslist", "icon": "<i class='fa fa-facebook-square'></i>", selected: false}
    //    ],
    //    socialNetworks: [
    //        {"name": "Facebook", "icon": "<i class='fa fa-facebook-square'></i>", selected: false},
    //        {"name": "Twitter", "icon": "<i class='fa fa-twitter-square'></i>", selected: false}
    //    ]
    //};

    //{"name": "Amazon", "class": "amazon", selected: false},
    //{"name": "Craigslist", "class": "craigslist", selected: false},

    factory.sources = {
        marketplaces: [
            {"name": "eBay", "class": "ebay", selected: false},
            {"name": "Facebook", "class": "facebook", selected: false},
            {"name": "Twitter", "class": "twitter", selected: false}
        ]
    };



    return factory;
}]);