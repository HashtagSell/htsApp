/**
 * Created by braddavis on 5/6/15.
 */
var common   = require('../config/common.js');
var env  = common.config();

var request = require('request');

exports.recache = function (req, res) {


    var postingId = req.body.posting.postingId;

    var recacheUrl = env.prerender_io.url + 'recache';
    var prerenderToken = env.prerender_io.token;
    var urlToPrerender = env.hts.appURL + '/feed/' + postingId;

    console.log('prerender token:', prerenderToken);
    console.log('urlToPrerender', urlToPrerender);

    var options = {
        uri: recacheUrl,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            "prerenderToken": prerenderToken,
            "url": urlToPrerender
        })
    };

    request.post(options, function callback(err, httpResponse, body) {
            if (err) {
                return console.error('precache failed:', err);
                res.send({success: false, data: err});
            }
            console.log('precache success', body);
            res.send({success: true, data: body});
        }
    );


};