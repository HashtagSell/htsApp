/**
 * Created by braddavis on 5/6/15.
 */
var util         = require('util');
var braintree    = require('braintree');

var common   = require('../config/common.js');
var env  = common.config();

var request = require('request');

var transaction_notification_api = require('./transaction_notification_api.js');
var braintree_webhook = require('./braintree_webhooks_api.js');

var User = require('../config/database/models/user.js');

// used to read in email template files
var fs = require("fs");

// used to compile the email templates
var ejs = require('ejs');

//Nodemail used to send email via Amazon SES
var mailer = require('../config/mailer/ses.js');

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





exports.createSubMerchant = function(req, res) {

    var subMerchantParams = req.body.subMerchant;
    subMerchantParams.masterMerchantAccountId = env.braintree.master_merchant_account_id;
    subMerchantParams.id = req.user._id;

    gateway.merchantAccount.create(subMerchantParams, function (err, result) {
        if(!err){

            User.findOne({'_id': req.user._id}, function (err, user) {

                // if there are any errors, return the error before anything else
                if (err)
                    return res.json({error: err});

                // if no user is found, return the message
                if (!user)
                    return res.json({error: "No user found with that Id."});

                if (user)

                    user.merchantAccount = {
                        id: result.merchantAccount.id,
                        status: result.merchantAccount.status,
                        currencyIsoCode: result.merchantAccount.currencyIsoCode,
                        subMerchantAccount: result.merchantAccount.subMerchantAccount,
                        masterMerchantAccount: {
                            id: result.merchantAccount.masterMerchantAccount.id,
                            status: result.merchantAccount.masterMerchantAccount.status,
                            currencyIsoCode: result.merchantAccount.masterMerchantAccount.currencyIsoCode,
                            subMerchantAccount: result.merchantAccount.masterMerchantAccount.subMerchantAccount
                        }
                    };

                    user.save(function(err) {
                        if (err) {
                            throw err;
                        } else {

                            res.send(result);

                            //Simulate webook from braintree if running in dev.
                            if(process.env.NODE_ENV === "DEVELOPMENT"  || process.env.NODE_ENV === "STAGING"){

                                var sampleSubMerchantApproved = gateway.webhookTesting.sampleNotification('WebhookNotification.Kind.SubMerchantAccountAccepted', result.merchantAccount.id);

                                braintree_webhook.digest(sampleSubMerchantApproved);
                            }
                        }
                    });
            });

        } else {
            console.log(err);
            res.send(err);
        }
    });
};



exports.subMerchantApproved = function(webhookNotification){

    User.findOne({'merchantAccount.id': webhookNotification.subscription.id}, function (err, user) {

        if (user) {

            user.merchantAccount.status = 'active';

            user.save(function (err) {
                if (err) {
                    throw err;
                } else {
                    //Get the ejs template for submerchant acceptance
                    var subMerchAccepted_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/subMerchant_accepted_email_template.ejs', "utf8");

                    //Variables for EJS to inject into template
                    var emailObj =
                    {
                        user:{
                            name: user.user_settings.name,
                        },
                        images:{
                            fb_logo: "https://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                            twitter_logo: "https://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                            hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                        }
                    };

                    //Merge the template
                    var compiled_html = ejs.render(subMerchAccepted_template, emailObj);

                    //Setup plain text email in case user cannot view Rich text emails
                    var plain_text = "Congratulations, you're an approved HashtagSeller!";

                    //Build the email message
                    var opts = {
                        from: "HashtagSell <no-reply@hashtagsell.com>",
                        to: user.local.email,
                        subject: "Account approval",
                        html: compiled_html,
                        text: plain_text
                    };

                    // Send Forgot password email
                    mailer.sendMail(opts, function(error, info){
                        if(error){
                            console.log(error);
                        }else{
                            console.log('Message sent: ' + info.response);
                        }
                    });
                }
            });
        }
    });


};


exports.subMerchantDeclined = function(webhookNotification){

    console.log('declined', webhookNotification);


    User.findOne({'merchantAccount.id': webhookNotification.subscription.id}, function (err, user) {

        if (user) {

            user.merchantAccount.status = 'declined';

            user.save(function (err) {
                if (err) {
                    throw err;
                } else {
                    //Get the ejs template for submerchant acceptance
                    var subMerchAccepted_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/subMerchant_declined_email_template.ejs', "utf8");

                    //Variables for EJS to inject into template
                    var emailObj =
                    {
                        user:{
                            name: user.user_settings.name,
                        },
                        images:{
                            fb_logo: "https://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                            twitter_logo: "https://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                            hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                        }
                    };

                    //Merge the template
                    var compiled_html = ejs.render(subMerchAccepted_template, emailObj);

                    //Setup plain text email in case user cannot view Rich text emails
                    var plain_text = "We apologize for the inconvenience, but you payment gateway partner could not approve your request to be a HashtagSeller.";

                    //Build the email message
                    var opts = {
                        from: "HashtagSell <no-reply@hashtagsell.com>",
                        to: user.local.email,
                        subject: "Account not approved",
                        html: compiled_html,
                        text: plain_text
                    };

                    // Send Forgot password email
                    mailer.sendMail(opts, function(error, info){
                        if(error){
                            console.log(error);
                        }else{
                            console.log('Message sent: ' + info.response);
                        }
                    });
                }
            });
        }
    });


};