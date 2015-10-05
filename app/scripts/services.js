angular.module('leagueItemSetsApp')
    .service('RiotService', ['$http', 'apiKey', function ($http, apiKey) {

        var baseURL = 'https://global.api.pvp.net/';
        var APIKey = apiKey.GetKey();

        var Champions = {
            Get: function () { return $http.get(baseURL + 'api/lol/static-data/na/v1.2/champion?champData=image&' + APIKey); },
            GetByID: function (championID) { return $http.get(baseURL + 'api/lol/static-data/na/v1.2/champion/' + championID + '?champData=all&' + APIKey); }
        };

        var Summoner = {
            GetByName: function (summonerName) { return $http.get(baseURL + 'api/lol/na/v1.4/summoner/by-name/' + summonerName + '?' + APIKey); },
            GetByID: function (summonerID) { return $http.get(baseURL + 'api/lol/na/v2.5/league/by-summoner/' + summonerID + '/entry?' + APIKey); }
        };

        var Items = {
            Get: function () { return $http.get(baseURL + 'api/lol/static-data/na/v1.2/item?' + APIKey); }
        };

        var PatchVersions = {
            Get: function () { return $http.get(baseURL + 'api/lol/static-data/na/v1.2/versions?' + APIKey); }
        };

        var MatchHistory = {
            GetBySummonerID: function (summonerID, pageNumber) { return $http.get(baseURL + 'api/lol/na/v2.2/matchlist/by-summoner/' + summonerID + 
                    '?beginIndex=' + (pageNumber*5 - 5) + '&endIndex=' + (pageNumber*5) + '&' + APIKey); }
        };

        var OneMatch = {
            GetByMatchID: function (matchID) { return $http.get(baseURL + 'api/lol/na/v2.2/match/' + matchID + '?' + APIKey);}
        };

        var Challengers = {
            Get: function () { return $http.get(baseURL + 'api/lol/na/v2.5/league/challenger?type=RANKED_SOLO_5x5&' + APIKey); }
        };

        return {
            Champions: Champions,
            Summoner: Summoner,
            Items: Items,
            PatchVersions: PatchVersions,
            MatchHistory: MatchHistory,
            OneMatch: OneMatch,
            Challengers: Challengers
        };
    }])
    .service('SmartItemsService', ['$http', function ($http) {

        var baseURL = 'http://leagueitemsets-pythonfrueh.rhcloud.com/';
        var smartItemsURL = 'http://leagueitemsets-pythonfrueh.rhcloud.com/champion/';
        var allChampionsURL = 'http://leagueitemsets-pythonfrueh.rhcloud.com/champions';
        var queryStoredMatchURL = 'http://leagueitemsets-pythonfrueh.rhcloud.com/match';
        var currentPatchURL = 'http://leagueitemsets-pythonfrueh.rhcloud.com/patchinfo';

        var SmartItems = {
            Get: function (championId) { return $http.get(baseURL + 'champion/' + championId); }
        };

        var AllChampions = {
            Get: function () { return $http.get(baseURL + 'champions'); }
        };

        var StoredMatch = {
            GetByMatchID: function (matchId) { return $http.get(baseURL + 'match/' + matchId); }
        };

        var PatchInfo = {
            Get: function () { return $http.get(baseURL + 'patchinfo'); }
        };

        return {
            SmartItems: SmartItems,
            AllChampions: AllChampions,
            StoredMatch: StoredMatch,
            PatchInfo: PatchInfo
        };
}]);