/**
 * Created by braddavis on 4/22/15.
 */
htsApp.factory('metaFactory', ['ENV', function (ENV) {
    var factory = {};


    factory.metatags = {
        page: {
            title: "HashtagSell · Rethinking Online Classifieds",
            description: "HashtagSell.com is rethinking the way people buy and sell online.  Search millions of online classifieds in seconds!  Sell your next item with HashtagSell.com.",
            googleVerification: "QEL7PxohhyFKyG5zg8Utt8ohbB_HzYjdYUnDXdhFBt0",
            faviconUrl: ENV.htsAppUrl + "/images/favicon/favicon.ico"
        },
        facebook: {
            title: "HashtagSell Online Classifieds",
            image: ENV.htsAppUrl + "/images/logo/HashtagSell_Logo_Home.svg",
            site_name: "HashtagSell.com",
            description: "HashtagSell.com is rethinking the way people buy and sell online.  Search millions of online classifieds in seconds!  Sell your next item with HashtagSell.com.",
            url: ENV.htsAppUrl
        },
        twitter: {
            card: "summary",
            domain: "hashtagsell.com",
            site: "@hashtagsell",
            description: "HashtagSell.com is rethinking the way people buy and sell online.  Search millions of online classifieds in seconds!  Sell your next item with HashtagSell.com.",
            title: "HashtagSell.com - Rethinking Online Classifieds",
            url: ENV.htsAppUrl,
            creator: "",
            image: ENV.htsAppUrl + "/images/logo/HashtagSell_Logo_Home.svg",
            appIdiPhone: "",
            appIdiPad: "",
            appIdGooglePlay: "",
            appUrliPhone: "",
            appUrliPad: "",
            appUrlGooglePlay: ""
        }
    };


    return factory;
}]);