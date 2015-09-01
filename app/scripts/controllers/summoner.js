'use strict';

angular.module('leagueItemSetsApp')
    .controller('SummonerCtrl', function ($scope, $routeParams, $location, RiotService, Utilities) {

        //
        //Init
        //
        RiotService.Champions.Get().then(function (result) {
            $scope.champions = result.data.data;
        });

        RiotService.Items.Get().then(function (result) {
            $scope.items = result.data.data;
        });
        
        $scope.KDAColor = Utilities.KDAColor;

        if ($routeParams.summoner !== undefined) {
            if (isNaN($routeParams.summoner)) {
                RiotService.Summoner.GetByName($routeParams.summoner).then(function (result) {
                    getSummoner(result.data[Utilities.CleanText($routeParams.summoner)].id);
                });
            } else {
                getSummoner($routeParams.summoner);
            }
        }

        //
        //Events
        //
        $scope.searchSummoner = function (summoner) {
            $location.path('summoner/' + summoner);
        };

        $scope.openModal = function (items, summoner, champion) {
            $('#jsonModal').modal('show');

            var fileLocation = 'C:\\Riot Games\\League of Legends\\Config\\Champions\\' + champion.key + '\\Recommended';


            var blocks = [{
                    type: 'Block Title 1',
                    items: items
                }];
            var itemSetJSON = Utilities.CreateItemSetJSON(summoner + '\'s Build', blocks);
            var data = "text/json;charset=utf-8," + encodeURIComponent(angular.toJson(itemSetJSON));

            $('#downloadButton').append('<a href="data:' + data + '" download="' + summoner + ' ' + champion.key + '.json">Download JSON</a>');
            $('#fileLocation').text(fileLocation);
            $('#modalLabel').text(summoner + '\'s ' + champion.key);
        };

        $scope.close = function () {
            $('#jsonModal').modal('hide');
            $('#downloadButton a').remove();
        };

        //
        //Functions
        //

        function getSummoner(summonerID) {
            RiotService.Summoner.GetByID(summonerID).then(function (result) {
                if(result.data[summonerID].length > 0){
                    $scope.summoner = result.data[summonerID][0].entries[0];
                    $scope.summoner.division = result.data[summonerID][0].tier + ' ' + $scope.summoner.division;
                    getMatchHistory(summonerID);
                }
            }, function(){
                $scope.showErrorMessage = true;
            });
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
                    match.participants[0].kda = match.participants[0].stats.kills + ' / ' + match.participants[0].stats.deaths + ' / ' + match.participants[0].stats.assists
                });
            });
        }
    });
