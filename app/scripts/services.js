angular
    .module('leagueItemSetsApp')
        .service('RiotService', ['$http', function ($http) {
            
            var baseURL = 'https://global.api.pvp.net/';
            var APIKey = '&api_key=ab9ef72b-ea32-4508-bcf7-51ab654189e5';
            
            var Champions = {
                Get: function(){ return $http.get(baseURL + 'api/lol/static-data/na/v1.2/champion?champData=image' + APIKey) }
            };

            return {
                Champions: Champions
            }
        }
    ]);