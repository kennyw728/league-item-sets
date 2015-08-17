'use strict';

/**
 * @ngdoc overview
 * @name leagueItemSetsApp
 * @description
 * # leagueItemSetsApp
 *
 * Main module of the application.
 */
angular
    .module('leagueItemSetsApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .when('/summoner/:summoner', {
                templateUrl: 'views/summoner.html',
                controller: 'SummonerCtrl',
                controllerAs: 'summoner'
            })
            .when('/summoner', {
                templateUrl: 'views/summoner.html',
                controller: 'SummonerCtrl',
                controllerAs: 'summoner'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
