angular.module('leagueItemSetsApp')
    .service('RiotService', ['$http', function ($http) {

            var baseURL = 'https://global.api.pvp.net/';
            var APIKey = 'api_key=ab9ef72b-ea32-4508-bcf7-51ab654189e5';

            var Champions = {
                Get: function () { return $http.get(baseURL + 'api/lol/static-data/na/v1.2/champion?champData=image&' + APIKey); },
                GetByID: function (championID) { return $http.get(baseURL + 'api/lol/static-data/na/v1.2/champion/' + championID + '?champData=image&' + APIKey); }
            };

            var Summoner = {
                GetByName: function (summonerName) { return $http.get(baseURL + 'api/lol/na/v1.4/summoner/by-name/' + summonerName + '?' + APIKey); },
                GetByID: function (summonerID) { return $http.get(baseURL + 'api/lol/na/v1.4/summoner/' + summonerID + '?' + APIKey); }
            };
            
            var Items = {
                Get: function () { return $http.get(baseURL + 'api/lol/static-data/na/v1.2/item?' + APIKey); }
            }
            
            var MatchHistory = {
                GetBySummonerID: function (summonerID) { return $http.get(baseURL + 'api/lol/na/v2.2/matchhistory/' + summonerID + '?' + APIKey); }
            }
            

            return {
                Champions: Champions,
                Summoner: Summoner,
                Items: Items,
                MatchHistory: MatchHistory
            };
        }
    ]);