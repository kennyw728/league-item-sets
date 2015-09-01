'use strict';

angular.module('leagueItemSetsApp')
    .controller('ChampionCtrl', function ($scope, $routeParams, $location, RiotService, Utilities) {

        $scope.toDownloadMostPopularItems = [];
        $scope.KDAGamesHighToLow = [];
        $scope.mostGamesHighToLow = [];


        $scope.highestKDAItems = [];
        $scope.highestKDAInfo = [];
        $scope.secondHighestKDAItems = [];
        $scope.secondHighestKDAInfo = [];
        $scope.thirdHighestKDAItems = [];
        $scope.thirdHighestKDAInfo = [];

        $scope.mostGamesPlayedItems = [];
        $scope.secondMostGamesPlayedItems = [];
        $scope.thirdMostGamesPlayedItems = [];

        RiotService.Champions.GetByID($routeParams.id).then(function(result){
            $scope.selectedChamp = result.data;
        });

        RiotService.Items.Get().then(function(results){
            $scope.allItems = results.data;


            // Once we have all items, we can create the custom itemsets without having to poll riot each time.
            RiotService.SmartItems.Get($routeParams.id).then(function(result){
                $scope.smartItems = result.data.results[0];


                $scope.mostPopularItems = $scope.smartItems.mostPopularItems;
                for (var i = 0; i < $scope.mostPopularItems.length; i++){
                    // Build actual item array for most popular items
                    $scope.toDownloadMostPopularItems.push($scope.allItems.data[$scope.mostPopularItems[i].itemId]);
                }

                // Look up matches of highest, second highest, and third highest KDA games
                RiotService.OneMatch.GetByMatchID($scope.smartItems.highestKDAGame.matchId).then(function(highestKDA){
                    // Look for the participant's champID and get itemset from just that player
                    for (var x = 0; x < 10; x++) {
                        if (highestKDA.data.participants[x].championId === $scope.selectedChamp.id) {

                            for (var i = 0; i < 7; i++) {
                                var itemID = highestKDA.data.participants[x].stats['item' + i];
                                if (itemID !== 0) {
                                    $scope.highestKDAItems.push(angular.copy($scope.allItems.data[itemID]));
                                }
                            }

                            var fullKDA = highestKDA.data.participants[x].stats.kills + ' / ' + highestKDA.data.participants[x].stats.deaths + ' / ' + highestKDA.data.participants[x].stats.assists

                            $scope.highestKDAInfo = {'summonerPlaying': highestKDA.data.participantIdentities[x].player.summonerName, 'itemArray': $scope.highestKDAItems, 'KDA': $scope.smartItems.highestKDAGame.KDA, 'fullKDA' : fullKDA};
                            break;
                        }
                    }
                });
                RiotService.OneMatch.GetByMatchID($scope.smartItems.secondHighestKDAGame.matchId).then(function(secondHighest){
                    // Look for the participant's champID and get itemset from just that player
                    for (var x = 0; x < 10; x++) {
                        if (secondHighest.data.participants[x].championId === $scope.selectedChamp.id) {
                            for (var i = 0; i < 7; i++) {
                                var itemID = secondHighest.data.participants[x].stats['item' + i];
                                if (itemID !== 0) {
                                    $scope.secondHighestKDAItems.push(angular.copy($scope.allItems.data[itemID]));
                                }
                            }
                            var fullKDA = secondHighest.data.participants[x].stats.kills + ' / ' + secondHighest.data.participants[x].stats.deaths + ' / ' + secondHighest.data.participants[x].stats.assists

                            $scope.secondHighestKDAInfo = {'summonerPlaying': secondHighest.data.participantIdentities[x].player.summonerName, 'itemArray': $scope.secondHighestKDAItems, 'KDA': $scope.smartItems.secondHighestKDAGame.KDA,  'fullKDA' : fullKDA};
                            break;
                        }
                    }
                });
                RiotService.OneMatch.GetByMatchID($scope.smartItems.thirdHighestKDAGame.matchId).then(function(thirdHighest){
                    // Look for the participant's champID and get itemset from just that player
                    for (var x = 0; x < 10; x++) {
                        if (thirdHighest.data.participants[x].championId === $scope.selectedChamp.id) {
                            for (var i = 0; i < 7; i++) {
                                var itemID = thirdHighest.data.participants[x].stats['item' + i];
                                if (itemID !== 0) {
                                    $scope.thirdHighestKDAItems.push(angular.copy($scope.allItems.data[itemID]));
                                }
                            }
                            var fullKDA = thirdHighest.data.participants[x].stats.kills + ' / ' + thirdHighest.data.participants[x].stats.deaths + ' / ' + thirdHighest.data.participants[x].stats.assists

                            $scope.thirdHighestKDAInfo = {'summonerPlaying': thirdHighest.data.participantIdentities[x].player.summonerName, 'itemArray': $scope.thirdHighestKDAItems, 'KDA': $scope.smartItems.thirdHighestKDAGame.KDA,  'fullKDA' : fullKDA};
                            break;
                        }
                    }
                });

            });
        });

        $scope.openModal = function (items, appendedText) {
            $('#jsonModal').modal('show');

            var fileLocation = 'C:\\Riot Games\\League of Legends\\Config\\Champions\\' + $scope.selectedChamp.key + '\\Recommended';


            var blocks = [{
                type: 'Block Title 1',
                items: items
            }];
            var itemSetJSON = Utilities.CreateItemSetJSON(appendedText + '\'s Build', blocks);
            var data = "text/json;charset=utf-8," + encodeURIComponent(angular.toJson(itemSetJSON));

            $('#downloadButton').append('<a href="data:' + data + '" download="' + appendedText + ' ' + $scope.selectedChamp.key + '.json">Download JSON</a>');
            $('#fileLocation').text(fileLocation);
            $('#modalLabel').text(appendedText + ' ' + $scope.selectedChamp.key);
        };

        $scope.close = function () {
            $('#jsonModal').modal('hide');
            $('#downloadButton a').remove();
        };

    });
