/**
 * Created by braddavis on 8/19/14.
 */

var Early_Access_Keys = require('../../config/database/models/early_access_keys.js');

exports.generateKeys = function(req, res){

    var adminUser = req.user.local.email;

    if(req.query.type == "individual" && req.query.quantity > 0) {  //Generate Individual Key

        var quantity = req.query.quantity;

        var keyLogs = {success : true, generated_by : adminUser, type : req.query.type, keys : []};

        for (i=0; i < quantity; i++) {

            var access_key = new Early_Access_Keys();

            access_key.secret.key = require('crypto').randomBytes(3).toString('hex');
            access_key.secret.type_of_key = req.query.type;
            access_key.secret.generated_by = adminUser;
            access_key.secret.expired = false;
            access_key.save(function (err, product, numberAffected){
                if (err) {
                    res.send({success: false, error: err});
                }
            });

            keyLogs.keys.push(access_key.secret.key);
        }
        res.send(keyLogs);

    } else if(req.query.type == "group" && req.query.key){  //Generate Group Key

        var access_key = new Early_Access_Keys();
        access_key.secret.key = req.query.key;
        access_key.secret.type_of_key = req.query.type;
        access_key.secret.generated_by = adminUser;
        access_key.secret.expired = false;
        access_key.save(function(err, product, numberAffected){
            if(err){
                res.send({success: false, error: err});
            } else {
                keyLogs = {success: true, generated_by: adminUser, type:req.query.type, key:req.query.key};
                res.send(keyLogs);
            }
        });
    } else {
        res.send({success:false, error: "missing parameters"});
    }

};