/**
 * Created by braddavis on 4/22/15.
 */
htsApp.factory('metaFactory', function () {
    var factory = {};


    factory.metatags = {
        page: {
            title: "HashtagSell · Rethinking Online Classifieds",
            description: "HashtagSell.com is rethinking the way people buy and sell online.  Search millions of online classifieds in seconds!  Sell your next item with HashtagSell.com.",
            googleVerification: "QEL7PxohhyFKyG5zg8Utt8ohbB_HzYjdYUnDXdhFBt0",
            faviconUrl: "https://static.hashtagsell.com/htsApp/favicon/favicon.ico"
        },
        facebook: {
            title: "HashtagSell Online Classifieds",
            image: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png",
            site_name: "HashtagSell.com",
            description: "HashtagSell.com is rethinking the way people buy and sell online.  Search millions of online classifieds in seconds!  Sell your next item with HashtagSell.com.",
            url: null
        },
        twitter: {
            card: "summary_large_image",
            site: "@hashtagsell",
            description: "HashtagSell.com is rethinking the way people buy and sell online.  Search millions of online classifieds in seconds!  Sell your next item with HashtagSell.com.",
            title: "HashtagSell.com - Rethinking Online Classifieds",
            creator: "@hashtagsell",
            image: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png",
        }
    };


    return factory;
});