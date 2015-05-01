var fs = require('fs');
var AWS = require('aws-sdk');
var common   = require('../config/common.js');
var config   = common.config();
var mongoose = require("mongoose");

var easyimg = require('easyimage');
var HashTable = require('hashtable');

AWS.config.region = 'us-west-2';

AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});



exports.upload = function(req, res) {

    var s3 = new AWS.S3();

    console.log("SETTING UP NEW HASHTABLE");
    var imageGroupHashtable = new HashTable();
    var hashcount = 0;

    var status = {success: null, images: []};

    var imgsToUpload = [];

    var photoToS3 = function (count) {

        if (count < imgsToUpload.length) {

            var imgObj = imgsToUpload[count];

            readImageFile(count, imgObj, uploadPhoto);

        } else {
            res.send(status);
        }

    };


    var readImageFile = function readfile(count, imgObj, callback) {

        console.log("reading image file", imgObj.path);

        fs.readFile(imgObj.path, function (err, file_buffer) {
            var params = {
                ACL: 'public-read',
                Bucket: config.aws.s3_static_bucket,
                Key: "posts/" + imgObj.name,
                Body: file_buffer,
                ContentType: imgObj.mimetype
            };

            callback(count, params, imgObj, deleteImg);

        });
    };


    var uploadPhoto = function (count, params, imgObj, callback) {

        s3.putObject(params, function (err, data) {

            if (err) {
                console.log(err);
                status.success = false;


            } else {

                status.success = true;

                console.log("Search hashtable for", imgObj.file);
                var indexOfImageGroup = imageGroupHashtable.get(imgObj.file);
                console.log("Hashtable response is: ", indexOfImageGroup);

                if(indexOfImageGroup !== undefined) {

                    console.log("hashtable found", indexOfImageGroup);
                    status.images[indexOfImageGroup][imgObj.type] = imgObj.url;

                } else {
                    console.log("setting hashtable", imgObj.file, "to", hashcount);

                    imageGroupHashtable.put(imgObj.file, hashcount);

                    hashcount = hashcount + 1;

                    var imgStatusObj = {};
                    imgStatusObj[imgObj.type] = imgObj.url;
                    status.images.push(imgStatusObj);
                }



            }

            callback(count, imgObj);
        });
    };


    var deleteImg = function (count, imgObj) {



        fs.unlink(imgObj.path, function (err) {
            if (err) {
                console.log(err);

            } else {
                console.log('successfully deleted', imgObj.path);
                photoToS3(count + 1);
            }
        });
    };



    var processPhotos = function (processingCount) {

        if (processingCount < numPhotos){

//            console.log(req.files);

            var fileNum = "file["+processingCount+"]";

            var image = req.files[fileNum];

            var path = image.path;
            var name = image.name;
            var mimetype = image.mimetype;
            var url = config.aws.s3_static_url + "/posts/" + name;
            var type = "full";

            var imgObj = {
                path: path,
                name: name,
                mimetype: mimetype,
                url: url,
                type: type,
                file:name
            };

            imgsToUpload.push(imgObj);

            easyimg.info(path).then(
                function(image) {
                    console.log(image);
                    if(image.width > 253){  //If larger than 253 px wide then create thumbnail
                        var thumb_name = 'thumb_' + name;
                        var thumb_path = 'tmp/' + thumb_name;
                        var thumb_url = config.aws.s3_static_url + "/posts/" + thumb_name;
                        var thumb_mimetype = mimetype;
                        var type = "thumbnail";
                        var thumb_imgObj = {path: thumb_path, name: thumb_name, mimetype: thumb_mimetype, url: thumb_url, type: type, file:name};

                        easyimg.resize({
                            src: path, dst: 'tmp/thumb_' + name,
                            width: 253
                        }).then(
                            function (image) {
                                console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
                                imgsToUpload.push(thumb_imgObj);

                                processPhotos(processingCount + 1);
                            },
                            function (err) {
                                console.log(err);
                                processPhotos(processingCount + 1);
                            }
                        );
                    } else {
                        processPhotos(processingCount + 1);
                    }
                }, function (err) { //Could not lookup image info
                    processPhotos(processingCount + 1);
                }
            );
        } else {
            photoToS3(0);
        }
    };

    var numPhotos = Object.keys(req.files).length;

    processPhotos(0);


};