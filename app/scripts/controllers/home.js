'use strict';

angular.module('leagueItemSetsApp')
    .controller('HomeCtrl', function ($scope, $location) {
        $scope.goTo = function(location){
            $location.path(location);
        }
    });
