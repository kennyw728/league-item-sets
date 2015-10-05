'use strict';

angular.module('leagueItemSetsApp')
    .controller('SummonerCtrl', function ($scope, $routeParams, $location, RiotService, Utilities) {

        //
        //Init
        //
        $scope.matches = [];
        $scope.KDAColor = Utilities.KDAColor;
        
        RiotService.Champions.Get().then(function (result) {
            $scope.champions = result.data.data;

            RiotService.Items.Get().then(function (result) {
                $scope.items = result.data.data;

                if ($routeParams.summoner !== undefined) {
                    if (isNaN($routeParams.summoner)) {
                        RiotService.Summoner.GetByName($routeParams.summoner).then(function (result) {
                            $scope.summonerID = result.data[Utilities.CleanText($routeParams.summoner)].id;
                            getSummoner($scope.summonerID);
                        });
                    } else {
                        $scope.summonerID = $routeParams.summoner;
                        getSummoner($scope.summonerID);
                    }
                }
            });
        });
        

        //
        //Events
        //
        $scope.searchSummoner = function (summoner) {
            $location.path('summoner/' + summoner);
        };
        
        $scope.next5 = function(pageNumber){
            getMatchHistory($scope.summonerID, pageNumber);
        }

        $scope.openModal = function (items, summoner, champion) {
            $('#jsonModal').modal('show');

            var fileLocation = 'C:\\Riot Games\\League of Legends\\Config\\Champions\\' + champion.key + '\\Recommended';


            var blocks = [{
                    type: summoner + '\'s Block',
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
                    getMatchHistory(summonerID, 1);
                }
            }, function(){
                $scope.showErrorMessage = true;
            });
        }

        function getMatchHistory(id, pageNumber) {
            RiotService.MatchHistory.GetBySummonerID(id, pageNumber).then(function (result) {
                $scope.matches = $scope.matches.concat(result.data.matches);
                angular.forEach($scope.matches, function (match) {
                    angular.forEach($scope.champions, function (champion) {
                        if (match.champion === champion.id) {
                            match.championDetail = champion;
                        }
                    });

                    RiotService.OneMatch.GetByMatchID(match.matchId).then(function(result){
                        var matchHistory = result.data;
                        for(var i = 0; i < 10; i++){
                            if(matchHistory.participantIdentities[i].player.summonerId === id){
                                var index = i;
                            }
                        }
                        var items = [];
                        for (var i = 0; i < 7; i++) {
                            var itemID = matchHistory.participants[index].stats['item' + i];
                            if (itemID !== 0) {
                                items.push(angular.copy($scope.items[itemID]));
                            }
                        }
                        match.items = items;
                        match.kda = matchHistory.participants[index].stats.kills + ' / ' + matchHistory.participants[index].stats.deaths + ' / ' + matchHistory.participants[index].stats.assists;
                    }).catch(function(){
                        toastr.error("You have made too many API calls at one time", "Cannot Retrieve Data");
                    });
                });
            });
        }
    });
