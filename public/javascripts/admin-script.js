'use strict';

var app = angular.module('cmsAdmin', ['ngRoute', 'ngResource']);

app.config(function($routeProvider) {
    $routeProvider.when('/admin/dashboard/', {
        templateUrl:'./adm_templates/indexlist.html',
        controller:'TableCtrl'
    });
});

app.controller('MenuCtrl', function($scope, postSvc, UserService, $location) {
    $scope.service = UserService;
    
    $scope.logout = function() {
        UserService.logout().success(function(data){
            $location.url('/');
        });
    };
    
    UserService.getAuthInfo();
});

app.controller('TableCtrl', function($scope, postSvc) {
    
    $scope.posts = postSvc.getPosts();
    
});