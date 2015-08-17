'use strict';

angular.module('leagueItemSetsApp')
    .controller('ChampionCtrl', function ($scope, $routeParams, $location, RiotService) {

        RiotService.Champions.GetByID($routeParams.id).then(function(result){
            $scope.selectedChamp = result.data;
        });

    });
