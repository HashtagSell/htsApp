var ebay = require('../index');
var conf = require('./config');

console.log(conf.RuName);

var params = {
  callname: 'GetSessionID',
  siteid: 0,
  data: {
    RuName: conf.RuName
  }
}

//TODO: Go here via browser
//https://signin.sandbox.ebay.com/ws/eBayISAPI.dll?SignIn&runame=HashtagSell__In-HashtagS-e6d2-4-sdojf&SessID=SESSION ID HERE


//var params = {
//  callname: 'FetchToken',
//  siteid: 0,
//  data: {
//    SessionID: [SESSION ID HERE TO GET TOKEN],
//  }
//}


ebay.call(params, function(err, result) {
  console.dir(result);
});
