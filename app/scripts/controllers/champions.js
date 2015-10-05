'use strict';

angular.module('leagueItemSetsApp')
    .controller('ChampionsCtrl', function ($scope, RiotService, SmartItemsService) {

        RiotService.PatchVersions.Get().then(function (patchVersion) {
            var latestPatch = patchVersion.data[0];
            $scope.dataDragonURL = '//ddragon.leagueoflegends.com/cdn/' + latestPatch + '/img/champion/';
        });

        SmartItemsService.PatchInfo.Get().then(function (PatchInfo) {
            $scope.currentPatch = PatchInfo.data.results[0].dbPatchVersion;
            $scope.numGames = PatchInfo.data.numGames;
            $scope.numBuilds = PatchInfo.data.numGames * 10;
        });

        RiotService.Champions.Get().then(function (result) {
            $scope.champions = result.data.data;
        });

        $scope.filter = function (filter) {
            angular.forEach($scope.champions, function (championDetail, championName) {
                championDetail.hide = true;
                if (championDetail.name.toLowerCase().indexOf(filter) > -1) {
                    championDetail.hide = false;
                }
            })
        };
    });
