var util = require('util'),
    OperationHelper = require('apac').OperationHelper,
    common   = require('../config/common.js'),
    config   = common.config();

var opHelper = new OperationHelper({
    awsId:     'AKIAJASAHA4PWYDT5SBQ',
    awsSecret: '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',
    assocId:   'hasht09-20'
    //xml2jsOptions: an extra, optional, parameter for if you want to pass additional options for the xml2js module. (see https://github.com/Leonidas-from-XIV/node-xml2js#options)
});


// execute(operation, params, callback)
// operation: select from http://docs.aws.amazon.com/AWSECommerceService/latest/DG/SummaryofA2SOperations.html
// params: parameters for operation (optional)
// callback(err, parsed, raw): callback function handling results. err = potential errors raised from xml2js.parseString() or http.request(). parsed = xml2js parsed response. raw = raw xml response.

opHelper.execute('ItemSearch', {
    'SearchIndex': 'All', //\'Software\',\'MP3Downloads\',\'OutdoorLiving\',\'FashionWomen\',\'Luggage\',\'All\',\'VideoGames\',\'Jewelry\',\'KindleStore\',\'Kitchen\',\'WirelessAccessories\',\'HealthPersonalCare\',\'OfficeProducts\',\'MusicalInstruments\',\'FashionGirls\',\'Blended\',\'Music\',\'Marketplace\',\'Automotive\',\'Industrial\',\'FashionBoys\',\'ArtsAndCrafts\',\'Photo\',\'Tools\',\'UnboxVideo\',\'FashionBaby\',\'FashionMen\',\'Books\',\'Appliances\',\'MobileApps\',\'DigitalMusic\',\'Electronics\',\'Video\',\'LawnAndGarden\',\'MusicTracks\',\'HomeGarden\',\'Apparel\',,\'Wireless\',\'Classical\',\'VHS\',\'Collectibles\',\'Magazines\',\'Miscellaneous\',\'Baby\',\'GiftCards\',\'GourmetFood\',\'Beauty\',\'SportingGoods\',\'DVD\',\'Grocery\',\'PCHardware\',\'Watches\',\'Fashion\',\'Shoes\',\'Toys\',\'PetSupplies\
    'Keywords': 'Honeywell air purifier', //hashtag keyword
    'ResponseGroup': 'ItemAttributes'
}, function(err, json, xml) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js
    console.log(util.inspect(json, false, null));
    //
    //for (var i=0; i < items.length; i++){
    //    console.log(items[i]);
    //}
    //console.log(xml);
});

// output:
// { ItemSearchResponse:
//    { '$': { xmlns: 'http://webservices.amazon.com/AWSECommerceService/2011-08-01' },
//      OperationRequest: [ [Object] ],
//      Items: [ [Object] ] } }