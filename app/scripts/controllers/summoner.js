'use strict';

angular.module('leagueItemSetsApp')
    .controller('SummonerCtrl', function ($scope, $routeParams, RiotService) {

        RiotService.Champions.Get().then(function (result) {
            $scope.champions = result.data.data;
        });

        RiotService.Items.Get().then(function (result) {
            $scope.items = result.data.data;
        });

        if ($routeParams.summoner !== undefined) {
            if (isNaN($routeParams.summoner)) {
                RiotService.Summoner.GetByName($routeParams.summoner).then(function (result) {
                    $scope.summoner = result.data[$routeParams.summoner];
                    getMatchHistory($scope.summoner.id);
                });
            } else {
                RiotService.Summoner.GetByID($routeParams.summoner).then(function (result) {
                    $scope.summoner = result.data[$routeParams.summoner];
                    getMatchHistory($scope.summoner.id);
                });
            }
        }

        function getMatchHistory(id) {
            RiotService.MatchHistory.GetBySummonerID(id).then(function (result) {
                $scope.matches = result.data.matches;
                angular.forEach($scope.matches, function (match) {
                    angular.forEach($scope.champions, function (champion) {
                        if (match.participants[0].championId === champion.id) {
                            match.participants[0].championDetail = champion;
                        }
                    });

                    var items = [];
                    for (var i = 0; i < 7; i++) {
                        var itemID = match.participants[0].stats['item' + i];
                        if (itemID !== 0) {
                            items.push(angular.copy($scope.items[itemID]));
                        }
                    }
                    match.participants[0].items = items;
                });
            });
        }
    });
