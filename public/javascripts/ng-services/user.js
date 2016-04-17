'use strict';

app.factory('UserService', function($http, $location) {
    return {
        saveUser:function(user) {
            return $http.post('/signup', user);
        },
        login:function(user) {
            return $http.post('/login', user);
        },
        getAuthInfo:function() {
            var that = this;
            return $http.get('/isAuth').success(function(data) {
                that.authInfo = data;
                $location.url('/');
            });
        },
        logout:function() {
            var that = this;
            return $http.get('/logout').success(function(data) {
                that.authInfo = {};
                $location.url('/');
            });
        },
        eraseInfo:function() {
            this.authInfo = {};
        },
        authInfo:{}
    };
});