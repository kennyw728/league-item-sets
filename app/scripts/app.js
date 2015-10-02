'use strict';

/**
 * @ngdoc overview
 * @name leagueItemSetsApp
 * @description
 * # leagueItemSetsApp
 *
 * Main module of the application.
 */
angular.module('leagueItemSetsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
]).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'home'
        })
        .when('/summoner/:summoner', {
            templateUrl: 'views/summoner.html',
            controller: 'SummonerCtrl',
            controllerAs: 'summoner'
        })
        .when('/summoners', {
            templateUrl: 'views/summoners.html',
            controller: 'SummonersCtrl',
            controllerAs: 'summoners'
        })
        .when('/champions/', {
            templateUrl: 'views/champions.html',
            controller: 'ChampionsCtrl',
            controllerAs: 'champions'
        })
        .when('/champion/:id', {
            templateUrl: 'views/champion.html',
            controller: 'ChampionCtrl',
            controllerAs: 'champion'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'HomeCtrl',
            controllerAs: 'home'
        })
        .otherwise({
            redirectTo: '/'
        });
}).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);