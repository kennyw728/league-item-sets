"use strict";angular.module("leagueItemSetsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/home.html",controller:"HomeCtrl",controllerAs:"home"}).when("/summoner/:summoner",{templateUrl:"views/summoner.html",controller:"SummonerCtrl",controllerAs:"summoner"}).when("/summoners",{templateUrl:"views/summoners.html",controller:"SummonersCtrl",controllerAs:"summoners"}).when("/champions/",{templateUrl:"views/champions.html",controller:"ChampionsCtrl",controllerAs:"champions"}).when("/champion/:id",{templateUrl:"views/champion.html",controller:"ChampionCtrl",controllerAs:"champion"}).otherwise({redirectTo:"/"})}]).config(["$httpProvider",function(a){a.defaults.useXDomain=!0,delete a.defaults.headers.common["X-Requested-With"]}]),angular.module("leagueItemSetsApp").service("RiotService",["$http","apiKey",function(a,b){var c="https://global.api.pvp.net/",d="http://leagueitemsets-pythonfrueh.rhcloud.com/champion/",e=b.GetKey(),f={Get:function(){return a.get(c+"api/lol/static-data/na/v1.2/champion?champData=image&"+e)},GetByID:function(b){return a.get(c+"api/lol/static-data/na/v1.2/champion/"+b+"?champData=all&"+e)}},g={GetByName:function(b){return a.get(c+"api/lol/na/v1.4/summoner/by-name/"+b+"?"+e)},GetByID:function(b){return a.get(c+"api/lol/na/v2.5/league/by-summoner/"+b+"/entry?"+e)}},h={Get:function(){return a.get(c+"api/lol/static-data/na/v1.2/item?"+e)}},i={GetBySummonerID:function(b){return a.get(c+"api/lol/na/v2.2/matchhistory/"+b+"?"+e)}},j={GetByMatchID:function(b){return a.get(c+"api/lol/na/v2.2/match/"+b+"?"+e)}},k={Get:function(){return a.get(c+"api/lol/na/v2.5/league/challenger?type=RANKED_SOLO_5x5&"+e)}},l={Get:function(b){return a.get(d+b)}};return{Champions:f,Summoner:g,Items:h,MatchHistory:i,OneMatch:j,Challengers:k,SmartItems:l}}]),angular.module("leagueItemSetsApp").service("apiKey",[function(){var a=function(){return"api_key=ab619bf9-31e0-4237-819b-9159a922bc94"};return{GetKey:a}}]),angular.module("leagueItemSetsApp").filter("orderObjectBy",function(){return function(a,b,c){var d=[];return angular.forEach(a,function(a){d.push(a)}),d.sort(function(a,c){return a[b]>c[b]?1:-1}),c&&d.reverse(),d}}),angular.module("leagueItemSetsApp").service("Utilities",["RiotService",function(a){var b,c;a.Items.Get().then(function(a){b=a.data.data,c={type:"All Consumables",recMath:!1,minSummonerLevel:-1,maxSummonerLevel:-1,showIfSummonerSpell:"",hideIfSummonerSpell:"",items:[]},angular.forEach(b,function(a){a.consumed===!0&&a.tags&&c.items.push({id:a.id.toString(),count:1})})});var d=function(a){return a.toLowerCase().replace(/ /g,"")},e=function(a,b){var d={title:a,type:"custom",map:"any",mode:"any",priority:"false",sortrank:0,blocks:[]};return angular.forEach(b,function(a){var b={type:a.type,recMath:!1,minSummonerLevel:-1,maxSummonerLevel:-1,showIfSummonerSpell:"",hideIfSummonerSpell:"",items:[]};angular.forEach(a.items,function(a){b.items.push({id:a.id.toString(),count:1})}),d.blocks.push(b)}),d.blocks.push(c),d},f=function(a){var b=parseInt(a.split("/")[0]),c=parseInt(a.split("/")[1]),d=parseInt(a.split("/")[2]);return(b+d)/c>=5?"green":2>(b+d)/c?"{border-color: red}":"{border-color: white}"};return{CleanText:d,CreateItemSetJSON:e,KDAColor:f}}]),angular.module("leagueItemSetsApp").controller("ChampionsCtrl",["$scope","RiotService",function(a,b){b.Champions.Get().then(function(b){a.champions=b.data.data}),a.filter=function(b){angular.forEach(a.champions,function(a,c){a.hide=!0,c.toLowerCase().indexOf(b)>-1&&(a.hide=!1)})}}]),angular.module("leagueItemSetsApp").controller("ChampionCtrl",["$scope","$routeParams","$location","RiotService","Utilities",function(a,b,c,d,e){a.toDownloadMostPopularItems=[],a.KDAGamesHighToLow=[],a.mostGamesHighToLow=[],a.highestKDAItems=[],a.highestKDAInfo=[],a.secondHighestKDAItems=[],a.secondHighestKDAInfo=[],a.thirdHighestKDAItems=[],a.thirdHighestKDAInfo=[],a.mostGamesPlayedItems=[],a.secondMostGamesPlayedItems=[],a.thirdMostGamesPlayedItems=[],d.Champions.GetByID(b.id).then(function(b){a.selectedChamp=b.data}),d.Items.Get().then(function(c){a.allItems=c.data,d.SmartItems.Get(b.id).then(function(b){a.smartItems=b.data.results[0],a.mostPopularItems=a.smartItems.mostPopularItems;for(var c=0;c<a.mostPopularItems.length;c++)a.toDownloadMostPopularItems.push(a.allItems.data[a.mostPopularItems[c].itemId]);d.OneMatch.GetByMatchID(a.smartItems.highestKDAGame.matchId).then(function(b){for(var c=0;10>c;c++)if(b.data.participants[c].championId===a.selectedChamp.id){for(var d=0;7>d;d++){var e=b.data.participants[c].stats["item"+d];0!==e&&a.highestKDAItems.push(angular.copy(a.allItems.data[e]))}var f=b.data.participants[c].stats.kills+" / "+b.data.participants[c].stats.deaths+" / "+b.data.participants[c].stats.assists;a.highestKDAInfo={summonerPlaying:b.data.participantIdentities[c].player.summonerName,itemArray:a.highestKDAItems,KDA:a.smartItems.highestKDAGame.KDA,fullKDA:f};break}}),d.OneMatch.GetByMatchID(a.smartItems.secondHighestKDAGame.matchId).then(function(b){for(var c=0;10>c;c++)if(b.data.participants[c].championId===a.selectedChamp.id){for(var d=0;7>d;d++){var e=b.data.participants[c].stats["item"+d];0!==e&&a.secondHighestKDAItems.push(angular.copy(a.allItems.data[e]))}var f=b.data.participants[c].stats.kills+" / "+b.data.participants[c].stats.deaths+" / "+b.data.participants[c].stats.assists;a.secondHighestKDAInfo={summonerPlaying:b.data.participantIdentities[c].player.summonerName,itemArray:a.secondHighestKDAItems,KDA:a.smartItems.secondHighestKDAGame.KDA,fullKDA:f};break}}),d.OneMatch.GetByMatchID(a.smartItems.thirdHighestKDAGame.matchId).then(function(b){for(var c=0;10>c;c++)if(b.data.participants[c].championId===a.selectedChamp.id){for(var d=0;7>d;d++){var e=b.data.participants[c].stats["item"+d];0!==e&&a.thirdHighestKDAItems.push(angular.copy(a.allItems.data[e]))}var f=b.data.participants[c].stats.kills+" / "+b.data.participants[c].stats.deaths+" / "+b.data.participants[c].stats.assists;a.thirdHighestKDAInfo={summonerPlaying:b.data.participantIdentities[c].player.summonerName,itemArray:a.thirdHighestKDAItems,KDA:a.smartItems.thirdHighestKDAGame.KDA,fullKDA:f};break}})})}),a.openModal=function(b,c){$("#jsonModal").modal("show");var d="C:\\Riot Games\\League of Legends\\Config\\Champions\\"+a.selectedChamp.key+"\\Recommended",f=[{type:"Block Title 1",items:b}],g=e.CreateItemSetJSON(c+"'s Build",f),h="text/json;charset=utf-8,"+encodeURIComponent(angular.toJson(g));$("#downloadButton").append('<a href="data:'+h+'" download="'+c+" "+a.selectedChamp.key+'.json">Download JSON</a>'),$("#fileLocation").text(d),$("#modalLabel").text(c+" "+a.selectedChamp.key)},a.close=function(){$("#jsonModal").modal("hide"),$("#downloadButton a").remove()}}]),angular.module("leagueItemSetsApp").controller("HomeCtrl",["$scope","$location",function(a,b){a.goTo=function(a){b.path(a)}}]),angular.module("leagueItemSetsApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("leagueItemSetsApp").controller("SummonerCtrl",["$scope","$routeParams","$location","RiotService","Utilities",function(a,b,c,d,e){function f(b){d.Summoner.GetByID(b).then(function(c){c.data[b].length>0&&(a.summoner=c.data[b][0].entries[0],a.summoner.division=c.data[b][0].tier+" "+a.summoner.division,g(b))},function(){a.showErrorMessage=!0})}function g(b){d.MatchHistory.GetBySummonerID(b).then(function(b){a.matches=b.data.matches,angular.forEach(a.matches,function(b){angular.forEach(a.champions,function(a){b.participants[0].championId===a.id&&(b.participants[0].championDetail=a)});for(var c=[],d=0;7>d;d++){var e=b.participants[0].stats["item"+d];0!==e&&c.push(angular.copy(a.items[e]))}b.participants[0].items=c,b.participants[0].kda=b.participants[0].stats.kills+" / "+b.participants[0].stats.deaths+" / "+b.participants[0].stats.assists})})}a.KDAColor=e.KDAColor,d.Champions.Get().then(function(c){a.champions=c.data.data,d.Items.Get().then(function(c){a.items=c.data.data,void 0!==b.summoner&&(isNaN(b.summoner)?d.Summoner.GetByName(b.summoner).then(function(a){f(a.data[e.CleanText(b.summoner)].id)}):f(b.summoner))})}),a.searchSummoner=function(a){c.path("summoner/"+a)},a.openModal=function(a,b,c){$("#jsonModal").modal("show");var d="C:\\Riot Games\\League of Legends\\Config\\Champions\\"+c.key+"\\Recommended",f=[{type:b+"'s Block",items:a}],g=e.CreateItemSetJSON(b+"'s Build",f),h="text/json;charset=utf-8,"+encodeURIComponent(angular.toJson(g));$("#downloadButton").append('<a href="data:'+h+'" download="'+b+" "+c.key+'.json">Download JSON</a>'),$("#fileLocation").text(d),$("#modalLabel").text(b+"'s "+c.key)},a.close=function(){$("#jsonModal").modal("hide"),$("#downloadButton a").remove()}}]),angular.module("leagueItemSetsApp").controller("SummonersCtrl",["$scope","$location","RiotService",function(a,b,c){c.Challengers.Get().then(function(b){a.challengers=b.data.entries}),a.searchSummoner=function(a){b.path("summoner/"+a)}}]),angular.module("leagueItemSetsApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/champion.html",'<div class="row"> <div class="col-md-1"> <img class="champIcon" src="{{\'//ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/\' + selectedChamp.image.full}}"> </div> <div> <span><h2>{{selectedChamp.name}}, {{selectedChamp.title}} ---- {{smartItems.totalGamesWithChampion}} challenger/master games analyzed</h2></span> </div> </div> <br> <div class="row"> <div class="col-md-3"> <h3>Most Popular Items:</h3> </div> <div class="col-md-7"> <div class="col-xs-2" style="padding: 2px" ng-repeat="item in mostPopularItems"> <img style="width: 65%" ng-src="{{\'http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/\' + item.itemId + \'.png\'}}" title="Present in {{item.itemOccurrence}} final builds"> </div> </div> <div class="col-md-1"> <button type="button" class="btn btn-primary" ng-click="openModal(mostPopularItems, \'mostPopularItems\')">Get Item Set</button> </div> </div> <br> <br> <br> <br> <div class="row"> <h3> Highest KDA Final Builds: </h3> <div class="col-sm-3"></div> <div class="col-sm-3"> <div class="well" style="text-align: center"> <img class="champIcon" style="width: 75px; height: 75px" ng-src="{{\'//ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/\' + selectedChamp.image.full}}"> <h4 class="champTitle ellipsis">{{highestKDAInfo.fullKDA}} -- KDA: {{highestKDAInfo.KDA}}</h4> <h4 class="champTitle ellipsis">{{highestKDAInfo.summonerPlaying}}</h4> <div class="row" style="margin-bottom: 15px"> <div class="col-xs-6 col-xs-offset-3"> <div class="row"> <div class="col-xs-3" style="padding: 2px" ng-repeat="item in highestKDAInfo.itemArray"> <img style="width: 100%" ng-src="{{\'http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/\' + item.id + \'.png\'}}" title="{{item.name}}"> </div> </div> </div> </div> <button type="button" class="btn btn-primary" ng-click="openModal(highestKDAInfo.itemArray, \'highestKDA\')">Get Item Set</button> </div> </div> <div class="col-sm-3"> <div class="well" style="text-align: center"> <img class="champIcon" style="width: 75px; height: 75px" ng-src="{{\'//ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/\' + selectedChamp.image.full}}"> <h4 class="champTitle ellipsis">{{secondHighestKDAInfo.fullKDA}} -- KDA: {{secondHighestKDAInfo.KDA}}</h4> <h4 class="champTitle ellipsis">{{secondHighestKDAInfo.summonerPlaying}}</h4> <div class="row" style="margin-bottom: 15px"> <div class="col-xs-6 col-xs-offset-3"> <div class="row"> <div class="col-xs-3" style="padding: 2px" ng-repeat="item in secondHighestKDAInfo.itemArray"> <img style="width: 100%" ng-src="{{\'http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/\' + item.id + \'.png\'}}" title="{{item.name}}"> </div> </div> </div> </div> <button type="button" class="btn btn-primary" ng-click="openModal(secondHighestKDAInfo.itemArray, \'secondHighestKDA\')">Get Item Set</button> </div> </div> <div class="col-sm-3"> <div class="well" style="text-align: center"> <img class="champIcon" style="width: 75px; height: 75px" ng-src="{{\'//ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/\' + selectedChamp.image.full}}"> <h4 class="champTitle ellipsis">{{thirdHighestKDAInfo.fullKDA}} -- KDA: {{thirdHighestKDAInfo.KDA}}</h4> <h4 class="champTitle ellipsis">{{thirdHighestKDAInfo.summonerPlaying}}</h4> <div class="row" style="margin-bottom: 15px"> <div class="col-xs-6 col-xs-offset-3"> <div class="row"> <div class="col-xs-3" style="padding: 2px" ng-repeat="item in thirdHighestKDAInfo.itemArray"> <img style="width: 100%" ng-src="{{\'http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/\' + item.id + \'.png\'}}" title="{{item.name}}"> </div> </div> </div> </div> <button type="button" class="btn btn-primary" ng-click="openModal(thirdHighestKDAInfo.itemArray,\'thirdHighestKDA\')">Get Item Set</button> </div> </div> </div> <!-- Modal below --> <div class="modal fade" id="jsonModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false"> <div class="modal-dialog" role="document" style="margin-top: 200px"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="close()"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="modalLabel"></h4> </div> <div class="modal-body text-center"> <div> <label>Go to this directory (or associating Riot Games Directory):</label> <div style="margin: 0 0 10px 25px"><samp id="fileLocation"></samp></div> <label>and save the below file into the above directory.</label> </div> <button class="btn btn-primary" id="downloadButton" style="margin: 15px"></button> </div> <div class="modal-footer"> <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="close()">Close</button> </div> </div> </div> </div> <br>'),a.put("views/champions.html",'<form class="form-inline" style="text-align: center"> <div class="form-group"> <label>Filter</label> <input type="text" class="form-control" placeholder="Champion Name" ng-model="filterChampion" ng-keyup="filter(filterChampion)"> </div> </form> <hr> <div class="row"> <div class="col-md-1" ng-repeat="(championName, championDetail) in champions | orderObjectBy:\'name\'" ng-hide="championDetail.hide"> <a ng-href="#/champion/{{championDetail.id}}"><img class="champIcon" src="{{\'//ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/\' + championDetail.image.full}}"></a> <div class="champTitle ellipsis">{{championDetail.name}}</div> </div> </div>'),a.put("views/contact.html","<p>Created by Kenny Wong.</p>"),a.put("views/home.html",'<h2>Greetings Summoner</h2> <div style="margin: 25px"> Welcome to League Item Sets - a place where you can add item sets based on games in anyone\'s match history. </div> <div style="margin: 25px"> Click below if you want to search by a specific champion or by a specific player! </div> <div class="row"> <div class="col-lg-6" style="text-align: center"> <div class="well pointer wellHover" ng-click="goTo(\'champions\')"> <div class="wellText"> By Champions </div> <img src="http://i1-news.softpedia-static.com/images/news2/Download-Now-League-of-Legends-Patch-5-6-to-Get-New-Buffs-to-Old-Champions-476749-5.jpg" style="width:100%"> </div> </div> <div class="col-lg-6" style="text-align: center"> <div class="well pointer wellHover" ng-click="goTo(\'summoners\')"> <div class="wellText"> By Summoners </div> <img src="http://robustgaming.com/wp-content/uploads/2015/07/550px-CLG_Summer_2015-672x372.png" style="width:100%"> </div> </div> </div>'),a.put("views/summoner.html",'<form class="form-inline" style="text-align: center; margin-bottom: 25px" ng-submit="searchSummoner(newSummoner)"> <div class="form-group input-group"> <input type="text" class="form-control" style="width: 300px" placeholder="Enter a summoner" ng-model="newSummoner"> <span class="input-group-addon" ng-click="searchSummoner(newSummoner)">Go</span> </div> </form> <div style="text-align: center; margin: 150px 0" ng-show="showErrorMessage"> <h2>There is no summoner in NA with that name</h2> </div> <div ng-show="summoner.playerOrTeamName"> <hr> <div class="row" style="border: solid 1px; background-color: rgba(255, 255, 255, 0.04)"> <img class="headerIcon" src="https://avatar.leagueoflegends.com/na/{{summoner.playerOrTeamName}}.png"> <div class="headerText">{{summoner.playerOrTeamName}}</div> <div class="subheaderText">{{summoner.division}} - {{summoner.leaguePoints}}LP <span style="margin-left: 25px">Wins: {{summoner.wins}}</span></div> </div> <hr> </div> <div class="row"> <div class="col-sm-3" ng-repeat="match in matches| orderBy: \'-matchCreation\'" style="text-align: center"> <div class="well" ng-repeat="participant in match.participants"> <img class="champIcon" style="width: 75px; height: 75px" ng-src="{{\'//ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/\' + participant.championDetail.image.full}}"> <h4 class="champTitle ellipsis">{{participant.kda}}</h4> <div class="row" style="margin-bottom: 15px"> <div class="col-xs-6 col-xs-offset-3"> <div class="row"> <div class="col-xs-3" style="padding: 2px" ng-repeat="item in participant.items"> <img style="width: 100%" ng-src="{{\'http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/\' + item.id + \'.png\'}}" title="{{item.name}}"> </div> </div> </div> </div> <button type="button" class="btn btn-primary" ng-click="openModal(participant.items, summoner.playerOrTeamName, participant.championDetail)">Get Item Set</button> </div> </div> </div> <!-- Modal below --> <div class="modal fade" id="jsonModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false"> <div class="modal-dialog" role="document" style="margin-top: 200px"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="close()"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="modalLabel"></h4> </div> <div class="modal-body text-center"> <div> <label>Go to this directory (or associating Riot Games Directory):</label> <div style="margin: 0 0 10px 25px"><samp id="fileLocation"></samp></div> <label>and save the below file into the above directory.</label> </div> <button class="btn btn-primary" id="downloadButton" style="margin: 15px"></button> </div> <div class="modal-footer"> <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="close()">Close</button> </div> </div> </div> </div>'),a.put("views/summoners.html",'<form class="form-inline" style="text-align: center; margin-bottom: 25px" ng-submit="searchSummoner(newSummoner)"> <div class="form-group input-group"> <input type="text" class="form-control" style="width: 300px" placeholder="Enter a summoner" ng-model="newSummoner"> <span class="input-group-addon" ng-click="searchSummoner(newSummoner)">Go</span> </div> </form> <div style="text-align: center"> or search for challenger player below <hr> </div> <div class="row"> <div class="col-sm-3" ng-repeat="challenger in challengers| orderBy: \'-leaguePoints\'"> <div class="well wellHover pointer" style="text-align: center" ng-click="searchSummoner(challenger.playerOrTeamName)"> <img class="champIcon" style="width: 75px; height: 75px" src="https://avatar.leagueoflegends.com/na/{{challenger.playerOrTeamName}}.png"> <h4 class="champTitle ellipsis">{{challenger.playerOrTeamName}}</h4> <h5 class="champTitle ellipsis">{{challenger.leaguePoints}} LP <span style="margin-left: 15px">WINS: {{challenger.wins}}</span></h5> </div> </div> </div>')}]);