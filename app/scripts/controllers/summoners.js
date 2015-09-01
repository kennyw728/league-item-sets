'use strict';

angular.module('leagueItemSetsApp')
    .controller('SummonersCtrl', function ($scope, $routeParams, $location, RiotService, Utilities) {

        //
        //Init
        //
        RiotService.Challengers.Get().then(function (result) {
            $scope.challengers = result.data.entries;
            console.log($scope.challengers);
        });
        
        //
        //Events
        //
        $scope.searchSummoner = function (summoner) {
            $location.path('summoner/' + summoner);
        };
    });
