angular.module('leagueItemSetsApp')
    .service('Utilities', ['$http', 'apiKey', function ($http, apiKey) {

            var CleanText = function (text) {
                return text.toLowerCase().replace(/ /g, '');
            };

            var CreateItemSetJSON = function (title, blocks) {
                var result = {
                    title: title,
                    type: 'custom',
                    map: 'any',
                    mode: 'any',
                    priority: 'false',
                    sortrank: 0,
                    blocks: []
                };

                angular.forEach(blocks, function (block) {
                    var newBlock = {
                        type: block.type,
                        recMath: false,
                        minSummonerLevel: -1,
                        maxSummonerLevel: -1,
                        showIfSummonerSpell: "",
                        hideIfSummonerSpell: "",
                        items: []
                    }
                    angular.forEach(block.items, function (item) {
                        newBlock.items.push({
                            id: item.id.toString(),
                            count: 1
                        });
                    });
                    
                    result.blocks.push(newBlock);
                });
                
                return result;
            };
            
            var KDAColor = function (kda) {
                var k = parseInt(kda.split('/')[0]);
                var d = parseInt(kda.split('/')[1]);
                var a = parseInt(kda.split('/')[2]);
                if((k + a) / d >= 5){
                    return 'green';
                }
                if((k + a) / d < 2){
                    return '{border-color: red}';
                }
                return '{border-color: white}';
            };

            return {
                CleanText: CleanText,
                CreateItemSetJSON: CreateItemSetJSON,
                KDAColor: KDAColor
            };
        }
    ]);