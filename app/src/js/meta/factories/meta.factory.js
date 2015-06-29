/**
 * Created by braddavis on 4/22/15.
 */
htsApp.factory('metaFactory', function () {
    var factory = {};


    factory.metatags = {
        page: {
            title: "HashtagSell | Reinventing Online Classifieds",
            description: "HashtagSell is drastically improving how people sell items online. Share your item to eBay, Amazon, Craigslist and more with one click!",
            faviconUrl: "https://static.hashtagsell.com/htsApp/favicon/favicon.ico"
        },
        facebook: {
            title: "HashtagSell | Reinventing Online Classifieds",
            image: "https://static.hashtagsell.com/logos/hts/hi_res/Logo+(Complete).png",
            site_name: "HashtagSell.com",
            description: "HashtagSell is drastically improving how people sell items online. Share your item to eBay, Amazon, Craigslist and more with one click!",
            url: null
        },
        twitter: {
            card: "summary_large_image",
            site: "@hashtagsell",
            description: "HashtagSell is drastically improving how people sell items online. Share your item to eBay, Amazon, Craigslist and more with one click!",
            title: "HashtagSell.com | Reinventing Online Classifieds",
            creator: "@hashtagsell",
            image: "https://static.hashtagsell.com/logos/hts/hi_res/Logo+(Complete).png"
        }
    };


    return factory;
});