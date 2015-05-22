var fs = require('fs');
var AWS = require('aws-sdk');
var common   = require('../config/common.js');
var config   = common.config();
var mongoose = require("mongoose");

var easyimg = require('easyimage');

var async = require('async');

var s3 = new AWS.S3();

exports.newUpload = function(req, res) {

    var numPhotos = Object.keys(req.files).length;

    async.waterfall([

        function(done) {

            var imgsToUpload = [];

            var processPhotos = function (index) {

                if (index < numPhotos){

                    var fileNum = "file["+index+"]";

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

                    imgsToUpload[index] = {
                        'full': imgObj
                    };

                    easyimg.info(path).then(
                        function(image) {
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

                                        imgsToUpload[index].thumbnail = thumb_imgObj;

                                        processPhotos(index + 1);
                                    },
                                    function (err) {
                                        done(err);
                                        processPhotos(index + 1);
                                    }
                                );
                            } else {
                                processPhotos(index + 1);
                            }
                        }, function (err) { //Could not lookup image info
                            processPhotos(index + 1);
                        }
                    );
                } else {
                    done(null, imgsToUpload);
                }
            };

            processPhotos(0);
        },

        function(imgsToUpload, done) {

            var uploadPhotos = function (index) {

                if (index < numPhotos) {

                    var image = imgsToUpload[index];

                    fs.readFile(image.full.path, function (err, file_buffer) {
                        var fullImageParams = {
                            ACL: 'public-read',
                            Bucket: config.aws.s3_static_bucket,
                            Key: "posts/" + image.full.name,
                            Body: file_buffer,
                            ContentType: image.full.mimetype
                        };

                        s3.putObject(fullImageParams, function (err, data) {

                            if (err) {
                                console.log(err);
                                image.full.uploaded = false;
                                done(err);

                            } else {

                                image.full.uploaded = true;

                                if (image.thumbnail) {

                                    fs.readFile(image.thumbnail.path, function (err, file_buffer) {
                                        var thumbnailImageParams = {
                                            ACL: 'public-read',
                                            Bucket: config.aws.s3_static_bucket,
                                            Key: "posts/" + image.thumbnail.name,
                                            Body: file_buffer,
                                            ContentType: image.thumbnail.mimetype
                                        };

                                        s3.putObject(thumbnailImageParams, function (err, data) {

                                            if (err) {
                                                image.thumbnail.uploaded = false;
                                                console.log(err);
                                                done(err);

                                            } else {
                                                image.thumbnail.uploaded = true;
                                                uploadPhotos(index + 1);
                                            }
                                        });

                                    });
                                } else {
                                    uploadPhotos(index + 1);
                                }
                            }
                        });

                    });
                } else {
                    done(null, imgsToUpload);
                }
            };

            uploadPhotos(0);

        },

        function(imgsToUpload, done) {

            var cleanTempDir = function (index) {

                if (index < numPhotos) {

                    var image = imgsToUpload[index];

                    fs.unlink(image.full.path, function (err) {
                        if (err) {
                            console.log(err);
                            image.full.deleted = false;
                            done(err);

                        } else {
                            image.full.deleted = true;

                            if(image.thumbnail) {

                                fs.unlink(image.thumbnail.path, function (err) {
                                    if (err) {
                                        image.thumbnail.deleted = false;
                                        done(err);

                                    } else {
                                        image.thumbnail.deleted = true;
                                        cleanTempDir(index + 1);

                                    }
                                });

                            } else {
                                cleanTempDir(index + 1);
                            }
                        }
                    });

                } else {
                    done(null, imgsToUpload);
                }
            };
            cleanTempDir(0);
        }
    ], function(err, imgsToUpload) {
        if (err) {

            return res.json(
                {
                    success: false,
                    error: err
                }
            );
            throw err;

        } else {

            var imageUploadResponse = [];

            for(var i = 0; i < imgsToUpload.length; i++){
                var image = imgsToUpload[i];

                var tmpObj = {};

                if(image.full){
                    tmpObj.full = image.full.url;
                }

                if(image.thumbnail) {
                    tmpObj.thumbnail = image.thumbnail.url;
                }

                imageUploadResponse.push(tmpObj);
            }

            return res.json(
                {
                    success: true,
                    images: imageUploadResponse
                }
            );
        }
    });


};
