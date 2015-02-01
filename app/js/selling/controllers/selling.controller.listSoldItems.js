/**
 * Created by braddavis on 12/14/14.
 */
htsApp.controller('selling.controller.listSoldItems', ['$scope', 'sellingFactory', 'splashFactory', '$state', '$modal', 'newPostFactory', function ($scope, sellingFactory, splashFactory, $state, $modal, newPostFactory) {


    //openSplash called when suer clicks on item in feed for more details.
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        console.log(splashFactory.result);
        $state.go('selling.splash', { id: elems.result.external_id });
    };


    $scope.slickConfig = {
        dots: true,
        lazyLoad: 'progressive',
        infinite: true,
        speed: 100,
        slidesToScroll: 1,
        //TODO: Track this bug to allow for variableWidth on next release: https://github.com/kenwheeler/slick/issues/790
        variableWidth: true,
        centerMode: false

    };

    $scope.noItemsForSale = false;



    //Remove user's item from search results.  Apply deleted label.
    $scope.deletePost = function (result, index) {
        sellingFactory.deletePost(result).then(function (response) {

            if(response.status !== 200) {

                console.log(response.data.error);

            } else if (response.status === 200) {

                $scope.results.splice(index, 1);

            }
        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            alert("lookup error");

        });
    };




    $scope.pleaseWait = true;


    //self-executing function to lookup users items for sale.
    sellingFactory.init().then(function (response) {

        if(response.status !== 200) {

            $scope.results = response.data.error;

        } else if (response.status === 200) {

            //if (response.data.length) {
                $scope.results = response.data;
            $scope.pleaseWait = false;
            //} else {
            //    $scope.noItemsForSale = true;
            //}

        }
    }, function (response) {

        console.log(response);

        //TODO: Use modal service to notify users
        alert("lookup error");

    });




    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/newPost/modals/newPost/partials/newpost.html',
            controller: 'newPostModal',
            size: 'lg',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.modalContent.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.blah = function () {
        alert('meh');
    };

}]);