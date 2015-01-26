/**
 * Created by braddavis on 1/21/15.
 */
htsApp.controller('notifications.controller', ['$scope', function ($scope) {
    $scope.items = {
        collection: getRegularArray(1000)
    };


    function getRegularArray(size){
        var res = [];
        for(var i=0;i<size;i++){
            res.push({
                text: i,
                size: ~~(Math.random()*100 + 50)
            });
        }
        return res;
    }
}]);