/**
 * Created by braddavis on 5/6/15.
 */
var util         = require('util');
var braintree    = require('braintree');

var common   = require('../config/common.js');
var env  = common.config();

//Braintree config
var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: env.braintree.merchant_id,
    publicKey: env.braintree.public_key,
    privateKey: env.braintree.private_key
});


exports.getClientToken = function (req, res) {

    gateway.clientToken.generate({
        //if (req.body.customerId) {
        //    'customerId': req.body.customerId
        //}
    }, function (err, response) {
        res.send(response.clientToken);
    });

};



exports.sendPayment = function (req, res) {

    var nonce = req.body.payment_method_nonce;
    gateway.transaction.sale({
        amount: "10.00",
        paymentMethodNonce: nonce
    }, function (err, result) {
        if (err) {
            res.send('error:', err);
        } else {
            res.send('successfully charged $10, check your sandbox dashboard!');
        }
    });
};