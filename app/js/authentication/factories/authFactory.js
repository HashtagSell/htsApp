//This factory handles all our ajax posts to the server for sign-in, account creation, password reset, and changing the actual password
htsApp.factory('authFactory', ['$http', 'Session', '$q', '$window', function ($http, Session, $q) {

    var factory = {};

    // =====================================
    // LOGIN ===============================
    // =====================================
    factory.login = function (email, password) {

        var deferred = $q.defer();

        $http.post("/login", { "email": email, "password": password })

            //success
            .then(function (passportResponse) {

                if (passportResponse.data.success) { //We are logged in!!

                    Session.create(passportResponse.data);
                    deferred.resolve(passportResponse.data);

                } else { //There was an error logging the user in

                    deferred.resolve(passportResponse.data);

                }

            },
            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    // =====================================
    // SIGN UP =============================
    // =====================================
    factory.signUp = function (email, password, name, secret) {

        var deferred = $q.defer();

        $http.post("/signup", { "email": email, "password": password, "name": name, "secret": secret})

            //success
            .then(function (passportResponse) {

                if (passportResponse.data) { //Successful registration

                    deferred.resolve(passportResponse.data);

                }

            },
            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    // =====================================
    // FORGOT PASSWORD =====================
    // =====================================
    factory.passwordReset = function (email) {
        var deferred = $q.defer();

        $http.post('/forgot', { "email": email})

            .then(function (passportResponse) {

                if (passportResponse.data) {

                    deferred.resolve(passportResponse.data);

                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    // =====================================
    // RESETS PASSWORD =====================
    // =====================================
    factory.changePassword = function (password, token) {

        var deferred = $q.defer();

        $http.post('/reset', { "password": password, "token": token})

            .then(function (passportResponse) {

                if (passportResponse.data) {

                    deferred.resolve(passportResponse.data);

                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };




    // =====================================
    // UPDATE PASSWORD WHILE LOGGED IN =====
    // =====================================
    factory.updatePassword = function (currentPassword, newPassword) {

        var deferred = $q.defer();

        $http.post('/reset', { "currentPassword": currentPassword, "newPassword": newPassword})

            .then(function (passportResponse) {

                if (passportResponse.data) {

                    deferred.resolve(passportResponse.data);

                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    return factory;
}]);