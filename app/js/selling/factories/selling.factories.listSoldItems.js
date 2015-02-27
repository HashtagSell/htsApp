/**
 * Created by braddavis on 12/14/14.
 */
/**
 * Created by braddavis on 12/14/14.
 */
htsApp.factory('sellingFactory', ['$http', '$stateParams', '$location', '$q', 'ENV', 'utilsFactory', 'offersFactory', 'qaFactory', function ($http, $stateParams, $location, $q, ENV, utilsFactory, offersFactory, qaFactory){

    var factory = {};

    factory.getUsersItemsForSale = function (username) {

        var deferred = $q.defer();

        var params = {
            filters: {
                mandatory: {
                    exact: {
                        username: username
                    }
                }
            }
        };


        $http({
            method: 'GET',
            url: ENV.postingAPI + utilsFactory.bracketNotationURL(params)
        }).then(function (response) {
            console.log('users items for sale: ', response);

            factory.itemsForSale = response.data.results;


            if(factory.itemsForSale.length) {
                offersFactory.getAllOffers(factory.itemsForSale); //Lookup all the offers associated with all items for sale.
                qaFactory.getAllQuestions(factory.itemsForSale); //Lookup all the questions associated with all items for sale.
            }

            deferred.resolve(response);
        }, function (err) {
            deferred.reject(err);
        });



        return deferred.promise;
    };



    factory.deletePost = function (post) {

        var deferred = $q.defer();


        $http({
            method: 'DELETE',
            url: ENV.postingAPI + post.postingId
        }).then(function (response, status, headers, config) {

                console.log('delete response: ', response);

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };


    return factory;
}]);