'use strict';

angular.module('leagueItemSetsApp')
    .controller('MainCtrl', function ($scope, RiotService) {
        
        RiotService.Champions.Get().then(function(result){
            $scope.champions = result.data.data;
            console.log($scope.champions);
        });
    });
