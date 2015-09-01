#/usr/bin/env python

import requests
import pymongo
import json
import time
import datetime
import os
#from array import array
import itertools
import operator
from collections import Counter


# This script will be run after the database has been compiled with player builds.
# Its function is to grab match data from each champion from our "Matches" collection and determine the most frequently bought items.
# The final json for each champion will contain a "most frequently bought" build, a "best performing" build (by KDA), and a "most win by summoner" build

# Initialize env variables (disabled for local testing)
'''
OPENSHIFT_LOG_DIR = os.getenv("OPENSHIFT_LOG_DIR")
OPENSHIFT_MONGODB_DB_HOST = os.getenv("OPENSHIFT_MONGODB_DB_HOST")
OPENSHIFT_MONGODB_DB_PORT = int(os.getenv("OPENSHIFT_MONGODB_DB_PORT"))
OPENSHIFT_MONDODB_DB_USER = os.getenv("OPENSHIFT_MONGODB_DB_USERNAME")
OPENSHIFT_MONGODB_DB_PW = os.getenv("OPENSHIFT_MONGODB_DB_PASSWORD")
'''
# (For now, hard code db host/port/username/pw)
OPENSHIFT_MONGODB_DB_HOST = "127.0.0.1"
OPENSHIFT_MONGODB_DB_PORT = 27017
OPENSHIFT_MONDODB_DB_USER = "admin"
OPENSHIFT_MONGODB_DB_PW = "Q6rEwjkMR54p"

# Define mongo client
client = pymongo.MongoClient(OPENSHIFT_MONGODB_DB_HOST,OPENSHIFT_MONGODB_DB_PORT)
client.leagueitemsets.authenticate(OPENSHIFT_MONDODB_DB_USER, OPENSHIFT_MONGODB_DB_PW)
# Initialize leagueitemsets database
db = client.leagueitemsets 

# Do we want to clear the build dataset when this is run? Possibly...but we probably don't want to do it until we're ready to insert...


# Get list of champions - we want to loop through each one and generate/upload JSON to our "champion" collection
championListResponse = requests.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=6140bf70-7719-45c3-804d-300dc1c8f55f')
championJSONobject = json.loads(championListResponse.text)
championJSONData = championJSONobject['data']


for key, values in championJSONData.items():

	# (For debugging purposes)
	#print('champName: ' + str(values['name']) + '; champID: ' + str(values['id']) )

	# Get all matches played with this champ
	currentChampId = values['id']
	print('current champ id:' + str(currentChampId))
	matchesWithCurrentChamp = db.Matches.find({'championId': currentChampId})
	currentChampMatchCount = db.Matches.find({'championId': currentChampId}).count()
	#print(currentChampMatchCount)

	# (For debugging purposes)
	#print(matchesWithCurrentChamp)

	fullArrayOfItems = []
	matchKDADict = {}
	fullArrayOfWinningItems = []
	championSummonerDict = {} # summonerID: gamesPlayed (for a specific champion)
	
	# If we have matches played by this champ, we'll find them here! (If not, well...oops?)
	if currentChampMatchCount > 0:
		for match in matchesWithCurrentChamp:

			# Gather combined items
			tempItemArray = [ str(match['item0']), str(match['item1']), str(match['item2']), str(match['item3']), str(match['item4']), str(match['item5']), str(match['item6']) ]
			fullArrayOfItems += tempItemArray

			# If the player won the game, weigh their items twice as much as if they lost (and add their items to the "winningItems" list!)
			if match['winner'] == 'true':
				fullArrayOfItems += tempItemArray
				fullArrayOfWinningItems += tempItemArray

			# Get KDA for this match (assign death to 1 if there were no deaths) - we want to save time when creating the KDA list later!
			if match['deaths'] == 0: match['deaths'] = 1
			matchKDA = (match['kills'] + match['assists'] ) / match['deaths']
			matchKDADict[match['matchId']] = matchKDA
			#print(matchKDA)

			# Add counter for current match's summonerId to dict (for easier sorting later on)
			currentSummonerId = match['summonerId']
			#print(str(championSummonerDict[currentSummonerId]))
			
			try:
				championSummonerDict[currentSummonerId]
			except KeyError:
				# First time we saw this summoner play this champion
				championSummonerDict[currentSummonerId] = 1
			else: 
				championSummonerDict[currentSummonerId] += 1
			


		# See how matchKDA looks
		# print(matchKDADict)

		# See how championSummonerDict looks
		#print('championSummerDict variable looks like: ')
		#print(championSummonerDict)

		# Remove all empty item slots and trinkets prior to analysis
		trinketsAndEmptySlots = ['3361', '3362', '3363', '3364', '3342', '3341', '3340', '3345', '3460', '0']
		
		adjustedItemList = [i for i in fullArrayOfItems if i not in trinketsAndEmptySlots]
		#print(adjustedItemList)

		# Who needs sleep?!
		#time.sleep(1)

		# Prior to removing trinkets and empty item slots - returns incorrect items (remove eventually, lol)
		#itemsToCountOLD = (item for item in fullArrayOfItems if item[:1])
		#cOLD = Counter(itemsToCountOLD)

		itemsToCount = (item for item in adjustedItemList if item[:1])
		c = Counter(itemsToCount)

		# At the most basic level (prior to doing any more in-depth analysis), this would be the most popular build
		#print(c.most_common(7))

		popularItemDetails = {}
		popularItemDetails['item0'] = {}
		popularItemDetails['item1'] = {}
		popularItemDetails['item2'] = {}
		popularItemDetails['item3'] = {}
		popularItemDetails['item4'] = {}
		popularItemDetails['item5'] = {}
		popularItemDetails['item6'] = {}

		mostCommonItems = c.most_common(7)
		#print(mostCommonItems)
		for idx, item in enumerate(mostCommonItems):
			# We'll return the item ID and the # of times the item was purchased (will show # of games bought/total # of games)
			#tempItemDetails = { int(item[0]), item[1] }
			#print(tempItemDetails)
			currentItem = 'item'+str(idx)
			popularItemDetails[currentItem]['itemId'] = int(item[0])
			popularItemDetails[currentItem]['itemOccurrence'] = item[1]


		print(str(popularItemDetails))

		# ------------- Builds by highest KDA ------------- #
		# For now, find the 3 highest KDAs with this champ, and use their builds! (Of course, we have to make sure at least 3 games were played!)
		sortedList = sorted(matchKDADict.items(), key=lambda x: x[1])
		#print(sortedList)
		highestKDAGame = sortedList[-1]
		if currentChampMatchCount > 1: secondHighestKDAGame = sortedList[-2]
		if currentChampMatchCount > 2: thirdHighestKDAGame = sortedList[-3]
		print('highest KDA after sort: ' + str(highestKDAGame))
		if currentChampMatchCount > 1: print('second highest KDA after sort: ' + str(secondHighestKDAGame))
		if currentChampMatchCount > 2: print('third highest KDA after sort: ' + str(thirdHighestKDAGame))
		print('matchId of highest KDA game: ' + str(highestKDAGame[0]))

		# This sub-document will return only the matchIds of the first, second, and third highest (we can calculate the KDAs later in Angular)


		# ------------- Builds by most played  ------------- #
		# This will find the summoner who played this champ the most (top 3) and display their most common builds
		matchesSortedByNumberGames = sorted(championSummonerDict.items(), key=lambda x: x[1])
		#print('sorted list: ' + str(matchesSortedByNumberGames))
		mostGamesPlayed = matchesSortedByNumberGames[-1]
		print(currentChampMatchCount)
		print(matchesSortedByNumberGames)
		if len(matchesSortedByNumberGames) >= 2: secondMostGamesPlayed = matchesSortedByNumberGames[-2]
		if len(matchesSortedByNumberGames) >= 3: thirdMostGamesPlayed = matchesSortedByNumberGames[-3]


		# ------ Finally compiling the json to export -------#
		championJSONBuilt = {}
		championJSONBuilt['mostPopularItems'] = {}
		championJSONBuilt['highestKDAGame'] = {}
		championJSONBuilt['secondHighestKDAGame'] = {}
		championJSONBuilt['thirdHighestKDAGame'] = {}
		championJSONBuilt['mostGamesPlayed'] = {}
		championJSONBuilt['secondMostGamesPlayed'] = {}
		championJSONBuilt['thirdMostGamesPlayed'] = {}

		# Compile the static json fields
		championJSONBuilt['championId'] = currentChampId

		# Store number of champ games played
		championJSONBuilt['totalGamesWithChampion'] = currentChampMatchCount

		# (Build most popular items)
		championJSONBuilt['mostPopularItems'] = popularItemDetails

		#championJSONBuilt['highestKDAGameId'] = highestKDAGame
		championJSONBuilt['highestKDAGame']['matchId'] = highestKDAGame[0]
		championJSONBuilt['highestKDAGame']['KDA'] = highestKDAGame[1]
		
		if currentChampMatchCount > 2:
			championJSONBuilt['secondHighestKDAGame']['matchId'] = secondHighestKDAGame[0]
			championJSONBuilt['secondHighestKDAGame']['KDA'] = secondHighestKDAGame[1]
			championJSONBuilt['thirdHighestKDAGame']['matchId'] = thirdHighestKDAGame[0]
			championJSONBuilt['thirdHighestKDAGame']['KDA'] = thirdHighestKDAGame[1]
		elif currentChampMatchCount == 2:
			championJSONBuilt['secondHighestKDAGame']['matchId'] = secondHighestKDAGame[0]
			championJSONBuilt['secondHighestKDAGame']['KDA'] = secondHighestKDAGame[1]
			championJSONBuilt['thirdHighestKDAGame']['matchId'] = 0
			championJSONBuilt['thirdHighestKDAGame']['KDA'] = 0
		elif currentChampMatchCount == 1:
			championJSONBuilt['secondHighestKDAGame']['matchId'] = 0
			championJSONBuilt['secondHighestKDAGame']['KDA'] = 0
			championJSONBuilt['thirdHighestKDAGame']['matchId'] = 0
			championJSONBuilt['thirdHighestKDAGame']['KDA'] = 0


		championJSONBuilt['mostGamesPlayed']['summonerId'] = mostGamesPlayed[0]
		championJSONBuilt['mostGamesPlayed']['numGamesPlayed'] = mostGamesPlayed[1]
		#championJSONBuilt['mostGamesPlayed'] = mostGamesPlayed
		if currentChampMatchCount > 2:
			championJSONBuilt['secondMostGamesPlayed']['summonerId'] = secondMostGamesPlayed[0]
			championJSONBuilt['secondMostGamesPlayed']['numGamesPlayed'] = secondMostGamesPlayed[1]
			championJSONBuilt['thirdMostGamesPlayed']['summonerId'] = thirdMostGamesPlayed[0]
			championJSONBuilt['thirdMostGamesPlayed']['numGamesPlayed'] = thirdMostGamesPlayed[1]
		elif currentChampMatchCount == 2:
			championJSONBuilt['secondMostGamesPlayed']['summonerId'] = secondMostGamesPlayed[0]
			championJSONBuilt['secondMostGamesPlayed']['numGamesPlayed'] = secondMostGamesPlayed[1]
			championJSONBuilt['thirdMostGamesPlayed']['summonerId'] = 0
			championJSONBuilt['thirdMostGamesPlayed']['numGamesPlayed'] = 0
		elif currentChampMatchCount == 1:
			championJSONBuilt['secondMostGamesPlayed']['summonerId'] = 0
			championJSONBuilt['secondMostGamesPlayed']['numGamesPlayed'] = 0
			championJSONBuilt['thirdMostGamesPlayed']['summonerId'] = 0
			championJSONBuilt['thirdMostGamesPlayed']['numGamesPlayed'] = 0

		# Build JSON
		championJSONToUpload = json.dumps(championJSONBuilt)

		# Insert the match!
		db.Champions.insert_one(json.loads(championJSONToUpload))

	else:
		# Well, this is awkward, no one played any games with this champ!
		print('No one played any recent games with ' + values['name'] + '...we''ll get right on that...')


	# Who needs sleep?!
	#time.sleep(3)



