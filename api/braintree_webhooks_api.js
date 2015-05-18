/**
 * Created by braddavis on 5/6/15.
 */
var util         = require('util');
var braintree    = require('braintree');

var common   = require('../config/common.js');
var env  = common.config();

var request = require('request');

var braintree_api = require('./braintree_api.js');

//Braintree config
var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: env.braintree.merchant_id,
    publicKey: env.braintree.public_key,
    privateKey: env.braintree.private_key
});


exports.verify = function (req, res) {

    var btChallenge = req.query.bt_challenge;

    res.send(gateway.webhookNotification.verify(btChallenge));
};


exports.digest = function (req, res) {
    var bt_signature = '';
    var bt_payload = '';

    if(req.body) {
        bt_signature = req.body.bt_signature;
        bt_payload = req.body.bt_payload;
    } else {
        bt_signature = req.bt_signature;
        bt_payload = req.bt_payload;
    }

    gateway.webhookNotification.parse(bt_signature, bt_payload, function (err, webhookNotification) {


        console.log("[Webhook Received " + webhookNotification.timestamp + "] | Kind: " + webhookNotification.kind + " | Subscription: " + webhookNotification.subscription.id);


        if(webhookNotification.kind === 'WebhookNotification.Kind.SubMerchantAccountApproved') {
            braintree_api.subMerchantApproved(webhookNotification);
            res.send(200);
        }


        //TODO: Catch all other webhooks here.
    });
};