/**
 * Created by braddavis on 5/6/15.
 */
var common   = require('../config/common.js');
var env  = common.config();

var request = require('request');


exports.recache = function (req, res) {

    var postingId = req.body.posting.postingId;

    request.post(env.prerender_io.url + '/recache', {prerenderToken: env.prerender_io.token, url: env.hts.appURL + 'ext/' + postingId}, function callback(err, httpResponse, body) {
        if (err) {
            return console.error('precache failed:', err);
            res.send({success: false, data: err});
        }
        console.log('precache success', body);
        res.send({success: true, data: body});
    });


};