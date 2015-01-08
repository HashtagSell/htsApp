/**
 * Created by braddavis on 12/14/14.
 */
htsApp.controller('selling.controller.listSoldItems', ['$scope', 'forSaleFactory', 'splashFactory', '$state', function ($scope, forSaleFactory, splashFactory, $state) {


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
        slidesToScroll: 2,
        //TODO: Track this bug to allow for variableWidth on next release: https://github.com/kenwheeler/slick/issues/790
        variableWidth: true,
        onInit: function () {
            jQuery(window).resize();
            console.log('slick caroseal loaded');
        },
        centerMode: true

    };


    forSaleFactory.init().then(function (response) {

        if(response.status !== 200) {

            $scope.results = response.data.error;

        } else if(response.status == 200) {

            $scope.results = response.data;

        }
    }, function (response) {

        console.log(response);

        //TODO: Use modal service to notify users
        alert("lookup error");

    });

}]);