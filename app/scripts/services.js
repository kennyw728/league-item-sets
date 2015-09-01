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
                Get: function () { return $http.get(baseURL + 'api/lol/static-data/na/v1.2/item?itemListData=all&' + APIKey); }
                };
            
            var MatchHistory = {
                GetBySummonerID: function (summonerID) { return $http.get(baseURL + 'api/lol/na/v2.2/matchhistory/' + summonerID + '?' + APIKey); }
            }
            
            var Challengers = {
                Get: function () { return $http.get(baseURL + 'api/lol/na/v2.5/league/challenger?type=RANKED_SOLO_5x5&' + APIKey); }
            }
            
            return {
                Champions: Champions,
                Summoner: Summoner,
                Items: Items,
                MatchHistory: MatchHistory,
                Challengers: Challengers
            };
        }
    ]);