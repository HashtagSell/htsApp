/**
 * Created by braddavis on 1/6/15.
 */
htsApp.controller('newPostModal', ['$scope', '$http', '$q', '$modalInstance', '$modal', 'mentionsFactory', '$templateCache', function ($scope, $http, $q, $modalInstance, $modal, mentionsFactory, $templateCache) {

    $scope.cleared = false;

    $scope.clearExample = function () {
        console.log("clearing contents");
        if (!$scope.cleared) {
            document.getElementById("htsPost").innerHTML = "";
            $scope.cleared = true;
        }
    };

    $scope.jsonObj = mentionsFactory.jsonTemplate;

    $scope.formatted_jsonObj = function () {
        return JSON.stringify($scope.jsonObj, null, 4);
    };

    $scope.macros = {
        'obo': '*Or Best Offer*',
        '(smile)': '<img src="http://a248.e.akamai.net/assets.github.com/images/icons/emoji/smile.png"' +
        ' height="20" width="20">'
    };

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

    //Wait until modalinstance initialized then setup dropzone
    $modalInstance.opened.then(function() {

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

                    console.log(response);

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
                        $scope.uploadMessage = 'Please wait while we finish up...';
                        $scope.$apply($scope.uploadProgress);
                    }
                }
            },
            'init': {}
        };
    });


    $scope.processPost = function () {

        if ($scope.numImages) {
            $scope.dropzoneConfig.init();
        } else {
            $scope.publishPost();
        }
    };


    $scope.publishPost = function () {
        console.log($scope.jsonObj);
        //alert("Publishing post.  THis ");
        var newPost = $scope.jsonObj;

        //loop through the hashtags and formulat the heading of post
        newPost.heading = '';
        for (i = 0; i < newPost.mentions.hashtags.length; i++) {
            if (i !== newPost.mentions.hashtags.length - 1) {
                newPost.heading += newPost.mentions.hashtags[i].hashtag + " ";
            } else {
                newPost.heading += newPost.mentions.hashtags[i].hashtag;
            }

            newPost.mentions.hashtags[i] = newPost.mentions.hashtags[i].hashtag; //Remove all the info we used to gather meta-data
        }

        $http.post('/newpost', newPost).
            success(function (status) {
                console.log("-----Post Complete----");
                console.log(status);
                $modalInstance.dismiss("post successful");
                $scope.jsonObj = mentionsFactory.jsonTemplate;
            });
    };

    //========= # Products =========
    $scope.searchProducts = function (term) {
        if (term) {
            mentionsFactory.predictProduct(term).then(function (results) {
                $scope.products = results;
                console.log("Here is scope.products", $scope.products);
            });
        }
    };

    $scope.getProductTextRaw = function (product) {
        mentionsFactory.getProductMetaData(product).then(function (jsonTemplate) {
            console.log(jsonTemplate);
            console.log("done");
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
        return '<span class="mention-highlighter" contentEditable="false">@' + selectedPlace.description + '</span>';
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

}]);