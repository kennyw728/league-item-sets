'use strict';

angular.module('leagueItemSetsApp')
    .controller('SummonersCtrl', function ($scope, $location, RiotService) {

        //
        //Init
        //
        RiotService.Challengers.Get().then(function (result) {
            $scope.challengers = result.data.entries;
        });
        
        //
        //Events
        //
        $scope.searchSummoner = function (summoner) {
            $location.path('summoner/' + summoner);
        };
    });
