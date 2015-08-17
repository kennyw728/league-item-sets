angular
    .module('leagueItemSetsApp')
        .service('RiotService', ['$http', function ($http) {
            
            var baseURL = 'https://global.api.pvp.net/';
            var APIKey = '&api_key=6140bf70-7719-45c3-804d-300dc1c8f55f';

        var Champions = {
                Get: function(){ return $http.get(baseURL + 'api/lol/static-data/na/v1.2/champion?champData=image' + APIKey) }
            };

            var Champion = {
                Get: function(champID){ return $http.get(baseURL + 'api/lol/static-data/na/v1.2/champion/' + champID +'?champData=all' + APIKey)}
            };

            return {
                Champions: Champions,
                Champion: Champion
            }
        }
    ]);