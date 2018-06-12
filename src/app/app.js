'use strict';

var m = angular.module('suaapp', [
    // Dependências internas
    'ngRoute',
    'ngCookies',
    'ngAnimate',
    'ngMessages',
    
    // Submódulos do Projeto
    'videoPlayer'
])

.controller(
    'SuaAppCtrl', [
        '$rootScope','$scope', '$routeParams', '$location', '$cookies', '$animate', '$sce',
        function($rootScope, $scope, $routeParams, $location, $cookies, $animate, $sce) {
            
        }
    ]
);