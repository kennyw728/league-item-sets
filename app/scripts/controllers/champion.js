'use strict';

angular.module('leagueItemSetsApp')
    .controller('ChampionCtrl', function ($scope, $routeParams, $location, RiotService, SmartItemsService, Utilities) {

        // Get patch version (most up-to-date artwork from data dragon)
        RiotService.PatchVersions.Get().then(function (patchVersion) {
            var latestPatch = patchVersion.data[0];
            $scope.dataDragonChampionURL = '//ddragon.leagueoflegends.com/cdn/' + latestPatch + '/img/champion/';
            $scope.dataDragonItemURL = '//ddragon.leagueoflegends.com/cdn/' + latestPatch + '/img/item/';
        });

        // New way
        $scope.mostPopularItemsFull = [];
        $scope.mostSuccessfulItemsFull = [];
        $scope.KDAGames = [];
        $scope.mostPlayed = [];

        RiotService.Champions.GetByID($routeParams.id).then(function (result) {
            $scope.selectedChamp = result.data;
            var champImage = result.data.image.full;
            $scope.champName = champImage.slice(0, champImage.indexOf("."));
        });

        RiotService.Items.Get().then(function (results) {
            $scope.allItems = results.data;


            // Once we have all items, we can create the custom itemsets without having to poll riot each time.
            SmartItemsService.SmartItems.Get($routeParams.id).then(function (result) {

                // Check to see if we have any game data stored -- in the case of Kindred (today is Sept 30th, they were patched in but not enabled), they have no games!
                if (result.data.results.length === 0) {
                    // No games played yet with this champ on this patch!
                    $scope.hideElements = true;
                    $scope.smartItems = []; $scope.smartItems.totalGamesWithChampion = 0;

                } else {
                    $scope.hideElements = false;
                    $scope.smartItems = result.data.results[0];

                    //$scope.allItemsWinRate = $scope.smartItems.allItemsWinRate;

                    // Create full popular items objects
                    $scope.mostPopularItems = $scope.smartItems.mostPopularItems;

                    for (var i = 0; i < Object.keys($scope.mostPopularItems).length; i++) {
                        // Build actual item array for most popular items
                        $scope.mostPopularItems['item' + i].itemName = $scope.allItems.data[$scope.mostPopularItems['item' + i].itemId].name;
                        $scope.mostPopularItemsFull.push($scope.allItems.data[$scope.mostPopularItems['item'+i].itemId]);
                        //$scope.mostPopularItems.push($scope.allItems.data[$scope.mostPopularItems['item'+i].itemId]);
                    }

                    // Create most successful items objects
                    $scope.mostSuccessfulItems = [];
                    for (var i = 0; i < Object.keys($scope.smartItems.allItemsWinRate).length; i++) {
                        // We only care about items that have appeared in more than half of the games (so we don't have any sterak's gage vaynes...)
                        var currentItem = $scope.smartItems.allItemsWinRate[i];
                        if (currentItem.itemWins + currentItem.itemLosses >= $scope.smartItems.totalGamesWithChampion / 20) {
                            // Build actual item array for most popular items
                            var itemWins = currentItem.itemWins;
                            var itemLosses = currentItem.itemLosses;
                            var gamesWithItem = itemWins + itemLosses;
                            var itemWinRate = itemWins * 100 / gamesWithItem;
                            $scope.mostSuccessfulItems.push({'itemId': currentItem.itemId,
                                'itemName': $scope.allItems.data[currentItem.itemId].name,
                                'itemWins': currentItem.itemWins,
                                'itemLosses': currentItem.itemLosses,
                                'itemWinRate': itemWinRate });
                        }
                    }
                    var sortedSuccessfulItems = $scope.mostSuccessfulItems.sort(function(a,b) {return (a.itemWinRate < b.itemWinRate) ? 1 : ((b.itemWinRate < a.itemWinRate) ? -1 : 0);} );
                    for (var i = 0; i < 7; i++) {
                        $scope.mostSuccessfulItemsFull.push($scope.allItems.data[sortedSuccessfulItems[i].itemId])
                    }

                    // For each item in our smartItems object, look up the corresponding match and store it in an array that we'll ng-repeat
                    // (We'll do this for both the highest KDA builds and the three summoners with the most games -- that one will work a bit differently)

                    var arrayOfMatches = ['highestKDAGame', 'secondHighestKDAGame', 'thirdHighestKDAGame']; // Add in most played games once I get that working in the backend...

                    arrayOfMatches.forEach(function (listItem, index) {
                        if (typeof $scope.smartItems[listItem] !== 'undefined') {
                            SmartItemsService.StoredMatch.GetByMatchID($scope.smartItems[listItem].matchId).then(function (tempMatch) {
                                // If it's one of the KDA games, put it in the KDA game object array; if it's a "most played" game, put it in that object array
                                if (listItem.indexOf('KDAGame') > -1) {
                                    // Remove the other participants that aren't playing the champion we selected!
                                    for (var x = tempMatch.data.results[0].participants.length - 1; x >= 0; x--) {
                                        if (tempMatch.data.results[0].participants[x].championId !== $scope.selectedChamp.id) {
                                            tempMatch.data.results[0].participants.splice(x, 1);
                                            tempMatch.data.results[0].participantIdentities.splice(x, 1);
                                        } else {
                                            // Store the participantIdentity info with the other Participant info
                                            //var currentParticipant = tempMatch.data.results[0].participantIdentities[x].player;
                                            var currentParticipantStats = tempMatch.data.results[0].participants[x].stats;
                                            tempMatch.data.results[0].participants[x].summonerId = tempMatch.data.results[0].participantIdentities[x].player.summonerId;
                                            tempMatch.data.results[0].participants[x].profileIcon = tempMatch.data.results[0].participantIdentities[x].player.profileIcon;
                                            tempMatch.data.results[0].participants[x].summonerName = tempMatch.data.results[0].participantIdentities[x].player.summonerName;
                                            tempMatch.data.results[0].participants[x].matchHistoryUri = tempMatch.data.results[0].participantIdentities[x].player.matchHistoryUri;
                                            tempMatch.data.results[0].participantIdentities.splice(x, 1);
                                            // Create simple array of items for ng-repeat
                                            tempMatch.data.results[0].itemSet = [];
                                            for (var y = 0; y < 6; y++) {
                                                if (currentParticipantStats['item' + y] !== 0) {
                                                    tempMatch.data.results[0].itemSet.push($scope.allItems.data[currentParticipantStats['item' + y]]);
                                                }
                                            }
                                        }
                                    }

                                    // Add the KDA info to the match so we don't have to calculate it again

                                    tempMatch.data.results[0].kda = $scope.smartItems[listItem].KDA;
                                    $scope.KDAGames.push(tempMatch.data.results[0]);
                                } else if (listItem.indexOf('MostGamesPlayed') > -1) {
                                    $scope.mostPlayed.push(tempMatch);
                                }
                            })
                        }
                    })
                }
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
    })


    // Filter for popular items - ngrepeat's "orderBy" doesn't natively work with some objects
    .filter("toArray", function(){
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(val, key) {
            result.push(val);
        });
        return result;
    }});