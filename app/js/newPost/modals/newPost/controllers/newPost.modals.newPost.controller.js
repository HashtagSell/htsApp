/**
 * Created by braddavis on 1/6/15.
 */
htsApp.controller('newPostModal', ['$scope', '$http', '$q', '$modalInstance', '$timeout', '$modal', 'mentionsFactory', '$templateCache', 'ENV', 'Session', 'authModalFactory', function ($scope, $http, $q, $modalInstance, $timeout, $modal, mentionsFactory, $templateCache, ENV, Session, authModalFactory) {

    $scope.demoCleared = false;

    $scope.clearDemo = function () {
        console.log("clearing contents");
        if (!$scope.demoCleared) {
            document.getElementById("htsPost").innerHTML = "";
            $scope.demoCleared = true;
        }
    };

    $scope.jsonObj = mentionsFactory.jsonTemplate;

    $scope.formatted_jsonObj = function () {
        return JSON.stringify($scope.jsonObj, null, 4);
    };

    //TODO: Handle auctions
    //$scope.macros = {
    //    'obo': '*Or Best Offer*'
    //};

    $scope.dismiss = function (reason) {
        mentionsFactory.resetJsonTemplate();
        $modalInstance.dismiss(reason);
    };

    //Wait until modalinstance initialized then setup dropzone
    $modalInstance.opened.then(function () {

        console.log($scope);

        $scope.dropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                paramName: "file", // The name that will be used to transfer the file
                maxFilesize: 15, // MB
                maxFiles: 10,
                thumbnailWidth: 48,
                thumbnailHeight: 48,
                previewTemplate: $templateCache.get('dropzone-thumbnail.html'),
                acceptedFiles: '.jpeg,.jpg,.png,.gif',
                url: "/upload",
                autoProcessQueue: false,
                uploadMultiple: true,
                parallelUploads: 10,
                clickable: "#imageUpload",
                previewsContainer: "#imgPreviewsContainer",
                dictDefaultMessage: ''
            },
            'eventHandlers': {
                'sendingmultiple': function (file, xhr, formData) {
                    console.log("sending for upload!");
                },
                'successmultiple': function (file, response) {

                    console.log('what is this!', response);

                    var newPost = $scope.jsonObj;

                    newPost.images = response.images;

                    $scope.publishPost();


                },
                'addedfile': function () {
                    console.log("image added");
                    if ($scope.numImages) {
                        $scope.numImages = $scope.numImages+1;
                        $scope.$apply($scope.numImages);
                    } else {
                        $scope.numImages = 1;
                        $scope.$apply($scope.numImages);
                    }
                },
                'removedfile': function () {
                    console.log("image removed");
                    $scope.numImages = $scope.numImages - 1;
                    scope.$apply($scope.numImages);
                },
                'uploadprogress': function(progress) {
                    //$scope.uploadProgress = progress;
                    //console.log($scope.uploadProgress);
                },
                'totaluploadprogress': function(progress) {
                    $scope.uploadProgress = progress;
                    $scope.$apply($scope.uploadProgress);
                    if(progress < 100) {
                        $scope.uploadMessage = progress+'%';
                        $scope.$apply($scope.uploadProgress);
                    } else if (progress === 100) {
                        $scope.uploadMessage = 'Preparing photos.. please wait.';
                        $scope.$apply($scope.uploadProgress);
                    }
                }
            },
            'init': {}
        };
    });


    $scope.processPost = function () {

        if(Session.userObj.user_settings.loggedIn) {

            if ($scope.numImages) {
                $scope.dropzoneConfig.init();
            } else {
                $scope.publishPost();
            }
        } else {

            authModalFactory.signInModal();

        }
    };


    $scope.publishPost = function () {
        var newPost = $scope.jsonObj;

        newPost.username = Session.userObj.user_settings.name;

        //loop through the hashtags and formulate the heading of post
        newPost.heading = '';
        for (i = 0; i < newPost.mentions.hashtags.length; i++) {
            if (i !== newPost.mentions.hashtags.length - 1) {
                newPost.heading += newPost.mentions.hashtags[i].hashtag + " ";
            } else {
                newPost.heading += newPost.mentions.hashtags[i].hashtag;
            }

            newPost.mentions.hashtags[i] = newPost.mentions.hashtags[i].hashtag; //Remove all the info we used to gather meta-data
        }

        //Josh's posting API
        $http.post('http://10.0.1.14:4043/v1/postings/', newPost).
            success(function(posting) {
                console.log("-----Post Complete----");
                console.log(posting);
                $modalInstance.dismiss({reason: "stageOneSuccess", post: posting});

            }).
            error(function(data, status, headers, config) {
                alert('post failed');
            });
    };

    //========= # Products =========
    $scope.searchProducts = function (term) {
        if (term) {
            mentionsFactory.predictProduct(term).then(function (results) {
                $scope.products = results;
                //console.log("Here is scope.products", $scope.products);
            });
        }
    };

    $scope.getProductTextRaw = function (product) {
        mentionsFactory.getProductMetaData(product).then(function (jsonTemplate) {
            //console.log(jsonTemplate);
            //console.log("done");
        });
        return '<span class="mention-highlighter" contentEditable="false">#' + product.value + '</span>';
    };


    //========= @ Places =========
    $scope.map = mentionsFactory.googleMap;

    $scope.searchPlaces = function (term) {
        if (term) {
            mentionsFactory.predictPlace(term).then(function (results) {
                $scope.places = results;
                console.log("Here is scope.places", $scope.places);
            });
        }
    };

    $scope.getPlacesTextRaw = function (selectedPlace) {
        mentionsFactory.getPlaceMetaData(selectedPlace).then(function (jsonTemplate) {
            console.log(jsonTemplate);
            console.log("done");
        });
        console.log("updated ui");
        return '<span class="mention-highlighter-location" contentEditable="false">@' + selectedPlace.description + '</span>';
    };

    //========= $ Prices =========
    $scope.searchPrice = function (term) {
        if (term) {
            $scope.prices = mentionsFactory.predictPrice(term);
            console.log("here is scope.prices", $scope.prices);
        }
    };

    $scope.getPricesTextRaw = function (selectedPrice) {
        mentionsFactory.getPriceMetaData(selectedPrice);
        return '<span class="mention-highlighter-price" contentEditable="false">$' + selectedPrice.suggestion + '</span>';
    };



    //Demo plays to describe how to sell an item
    (function demo () {
        $timeout(function () {
            if (!$scope.demoCleared) {
                $(".mention-highlighter").triggerHandler('show');
            }

            $timeout(function () {
                if (!$scope.demoCleared) {
                    $(".mention-highlighter").triggerHandler('hide');
                    $(".mention-highlighter-price").triggerHandler('show');
                }

                $timeout(function () {
                    if (!$scope.demoCleared) {
                        $(".mention-highlighter-price").triggerHandler('hide');
                        $(".mention-highlighter-location").triggerHandler('show');
                    }

                    $timeout(function () {
                        if (!$scope.demoCleared) {
                            $(".mention-highlighter-location").triggerHandler('hide');
                            $(".sellModalButton").triggerHandler('show');
                        }

                        $timeout(function () {
                            $(".sellModalButton").triggerHandler('hide');
                        }, 4000);

                    }, 4000);

                }, 4000);

            }, 4000);

        }, 1000);
    })();

}]);