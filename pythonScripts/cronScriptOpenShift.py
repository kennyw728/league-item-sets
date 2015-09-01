#/usr/bin/env python

import requests
import pymongo
import json
import time
import datetime
import os

now = datetime.datetime.now()
print(now)


#Initialize env variables

OPENSHIFT_LOG_DIR = os.getenv("OPENSHIFT_LOG_DIR")
OPENSHIFT_MONGODB_DB_HOST = os.getenv("OPENSHIFT_MONGODB_DB_HOST")
OPENSHIFT_MONGODB_DB_PORT = int(os.getenv("OPENSHIFT_MONGODB_DB_PORT"))
OPENSHIFT_MONDODB_DB_USER = os.getenv("OPENSHIFT_MONGODB_DB_USERNAME")
OPENSHIFT_MONGODB_DB_PW = os.getenv("OPENSHIFT_MONGODB_DB_PASSWORD")


# TODO: CHECK CURRENT PATCH - IF ON NEW PATCH, WE HAVE TO REMOVE ENTRIES FROM PREVIOUS PATCH


#Initialize temp folder path and file (for debugging purposes)
tempFolderPath = OPENSHIFT_LOG_DIR + "pythonScriptTest.log"

# Log info on mongodb for debugging purposes
pythonScriptTest = open(tempFolderPath,'a')
pythonScriptTest.write('------------------\n')
pythonScriptTest.close()

#Define mongo client
client = pymongo.MongoClient(OPENSHIFT_MONGODB_DB_HOST,OPENSHIFT_MONGODB_DB_PORT)
client.leagueitemsets.authenticate(OPENSHIFT_MONDODB_DB_USER, OPENSHIFT_MONGODB_DB_PW)


# Initialize database where I intend to store data
db = client.leagueitemsets 

# Look for challenger players
challengerJSONResponse = requests.get('https://na.api.pvp.net/api/lol/na/v2.5/league/challenger?type=RANKED_SOLO_5x5&api_key=6140bf70-7719-45c3-804d-300dc1c8f55f')
time.sleep(3) # Wait 3 seconds before looking for master-tier players

#Look for master players
mastersJSONResponse    = requests.get('https://na.api.pvp.net/api/lol/na/v2.5/league/master?type=RANKED_SOLO_5x5&api_key=6140bf70-7719-45c3-804d-300dc1c8f55f')

# Get status codes
#print(challengerJSONResponse.status_code)
#print(mastersJSONResponse.status_code)

challengerJSONobject = json.loads(challengerJSONResponse.text)
masterJSONobject = json.loads(mastersJSONResponse.text)

# Let's attempt to analyze said data!
listOfChallenjour = challengerJSONobject['entries']
listOfMasters = masterJSONobject['entries']

# For each player in challenger and masters, get their latest match history (attempting to join lists?)
challengerAndMasterPlayers = listOfChallenjour + listOfMasters

for specificPlayer in challengerAndMasterPlayers:
	#print(specificPlayer['playerOrTeamId'])
	#time.sleep(1)
	stringURL = 'https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/'+ str(specificPlayer['playerOrTeamId']) + '?api_key=6140bf70-7719-45c3-804d-300dc1c8f55f'

	playerInfo = requests.get(stringURL)	# Get match history!
	matchHistoryObject = json.loads(playerInfo.text)['matches']

	for eachMatch in matchHistoryObject:

		# We only care if it's SR map, solo/duo queue
		if eachMatch['queueType']=='RANKED_SOLO_5x5':

			# Get this match's match ID and champion playing.
			# If we find a match with this information already in the database, skip it!
			matchId = eachMatch['matchId']
			championId = eachMatch['participants'][0]['championId']

			# Only care if we haven't pushed this match to the database (for this particular player)
			sameMatchInDB = db.Matches.find({'matchId': matchId, 'championId': championId}).count()

			if sameMatchInDB == 0:

				# Build JSON for this match
				matchTrimmedData = {}
				matchTrimmedData['matchId'] = eachMatch['matchId']
				matchTrimmedData['matchVersion'] = eachMatch['matchVersion']
				matchTrimmedData['matchCreation'] = eachMatch['matchCreation']
				matchTrimmedData['championId'] = eachMatch['participants'][0]['championId']
				matchTrimmedData['summonerName'] = eachMatch['participantIdentities'][0]['player']['summonerName']
				matchTrimmedData['summonerId'] = eachMatch['participantIdentities'][0]['player']['summonerId']

				matchTrimmedData['item0'] = eachMatch['participants'][0]['stats']['item0']
				matchTrimmedData['item1'] = eachMatch['participants'][0]['stats']['item1']
				matchTrimmedData['item2'] = eachMatch['participants'][0]['stats']['item2']
				matchTrimmedData['item3'] = eachMatch['participants'][0]['stats']['item3']
				matchTrimmedData['item4'] = eachMatch['participants'][0]['stats']['item4']
				matchTrimmedData['item5'] = eachMatch['participants'][0]['stats']['item5']
				matchTrimmedData['item6'] = eachMatch['participants'][0]['stats']['item6']
				matchTrimmedData['winner'] = eachMatch['participants'][0]['stats']['winner']
				matchTrimmedData['kills'] = eachMatch['participants'][0]['stats']['kills']
				matchTrimmedData['deaths'] = eachMatch['participants'][0]['stats']['deaths']
				matchTrimmedData['assists'] = eachMatch['participants'][0]['stats']['assists']

				# Actual json creation step
				matchTrimmedJson = json.dumps(matchTrimmedData)
				#print(matchTrimmedData['summonerName'])
				#print(matchTrimmedData['summonerId'])

				# Insert the match!
				db.Matches.insert_one(json.loads(matchTrimmedJson))

				pythonScriptTest = open(tempFolderPath,'a')
				pythonScriptTest.write('MatchId of ' + str(matchId) + ' with championId ' + str(championId) + ' has just been added!\n')
				pythonScriptTest.close()

				# Pause before looking at next match in match history (only for debugging, isn't needed for API rate-limiting)
				#time.sleep(2)
			else:
				pythonScriptTest = open(tempFolderPath,'a')
				pythonScriptTest.write('MatchId of ' + str(matchId) + ' with championId ' + str(championId) + ' has already been added!\n')
				pythonScriptTest.close()


	# Wait a bit before grabbing the next set of match histories (rate limited api means we can only do 1 call every 1.2 seconds)
	time.sleep(3) 
