var app = angular.module('cmsApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'textAngular']).config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl:'/templates/posts-index.html',
        controller:'EntriesCtrl'
    });
    $routeProvider.when('/signup', {
        templateUrl:'/templates/signup.html',
        controller:'SignupForm'
    });
    $routeProvider.when('/login', {
        templateUrl:'/templates/login.html',
        controller:'loginCtrl'
    });
    $routeProvider.when('/admin/dashboard/', {
        templateUrl:'./templates/adm_templates/indexlist.html',
        controller:'EntriesCtrl'
    });
    $routeProvider.when('/admin/dashboard/new-post/',{
        templateUrl:'./templates/adm_templates/new_post.html',
        controller:'EntriesCtrl'
    });
    $routeProvider.when('/admin/dashboard/edit-post/', {
        templateUrl:'./templates/adm_templates/edit_post.html',
        controller:'EntriesCtrl'
    });
    $routeProvider.when('/post/:id*', {
        templateUrl:'./templates/post/single_post.html',
        controller:'PostCtrl'
    });
});