/**
 * Created by braddavis on 5/6/15.
 */
var util         = require('util');
var braintree    = require('braintree');

var common   = require('../config/common.js');
var env  = common.config();

var request = require('request');

var transaction_notification_api = require('./transaction_notification_api.js');

//Braintree config
var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: env.braintree.merchant_id,
    publicKey: env.braintree.public_key,
    privateKey: env.braintree.private_key
});


exports.getClientToken = function (req, res) {

    console.log('client token req.body', req.body);

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

    var postingId = req.body.postingId;

    request.get(env.hts.posting_api.url + '/' + postingId + '?offers=true', function (lookupError, response, body) {

        if (!lookupError && response.statusCode === 200) {

            var posting = JSON.parse(body);

            //If the item has a price and that price is greater than 0
            if(posting.askingPrice && posting.askingPrice.value > 0) {
                gateway.transaction.sale({
                    amount: posting.askingPrice.value,
                    paymentMethodNonce: nonce
                }, function (err, braintreeResponse) {
                    if (err) {
                        res.send({success: false, message: err});
                    } else {
                        res.send({success: true, result: braintreeResponse});

                        var sellerUsername = posting.username;
                        var buyerUsername;
                        var offerId = req.body.offerId;
                        var paymentReceipt = braintreeResponse;

                        //Find the creator of the offerId

                        console.log(posting);

                        for(var i = 0; i < posting.offers.results.length; i++) {

                            var offer = posting.offers.results[i];

                            if(offer.offerId === offerId){
                                buyerUsername = offer.username;
                                break;
                            }
                        }

                        transaction_notification_api.transactionCompleted(sellerUsername, buyerUsername, offerId, posting, paymentReceipt);

                    }
                });
            }


        } else {
            res.send({success: false, message: lookupError});
        }
    });
};