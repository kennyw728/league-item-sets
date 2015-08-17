'use strict';

angular.module('leagueItemSetsApp')
    .controller('ChampionCtrl', function ($scope, $routeParams, $location, RiotService) {

        RiotService.Champion.Get($routeParams.id).then(function(result){
            $scope.selectedChamp = result.data;
        });

    });
