'use strict';

angular.module('leagueItemSetsApp')
    .controller('MainCtrl', function ($scope, RiotService) {
        
        RiotService.Champions.Get().then(function(result){
            $scope.champions = result.data.data;
        });
        
        $scope.filter = function(filter){
            angular.forEach($scope.champions, function(championDetail, championName){
                championDetail.hide = true;
                if(championName.toLowerCase().indexOf(filter) > -1){
                    championDetail.hide = false;
                }
            })
        };
    });
