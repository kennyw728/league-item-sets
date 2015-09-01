# league-item-sets

[Live Site](http://kennyw728.github.io/league-item-sets/dist)

by Kenny Wong (NA: CantonNeko)
and Nathan Frueh (NA: urbanVenturer)

- This project gives us a chance to build a product using proper software practices to give back to the Riot community that we love as well as developing our own software skills.
- We chose to do Item Sets because whenever we play a new champion, we never know what to build. We would then look up a build on a 3rd party site and tab between that site and league during the game. 
    Really Inconvenient. We wanted to bridge that gap by allowing summoners to find a build they like and create a build path for them. With one click, save that itemset and never have to worry about 
    missing a build item again.

## Why you should like us! :D
- Usefulness
    - Multiple ways of finding historically proven successful builds by champion or by favorite summoners (top of the challenger ladder or your friends).
    - JSON file will be created and ready for you at a click of a button
    - Everything is one or two clicks away
- Technical Difficulty
    - We use a ton of current technologies that is relevant in the tech industry today.
    - We tried to maintain a codebase that is easily scalable with CSS classes or service calls
- Creativity/Originality
    - We hope it looks nice for our users
    - We havent seen anything online that can create item set JSON files easily and we hope we can fill that gap for summoners
- Project Documentation
    - Spent a lot of time here :D

## Our process
- Setup GitHub repository
- Download GitBash, NodeJS
- Use Yeoman to create our scaffolding website structure
- Use Netbeans to create/edit code
- Grunt to serve/test/dist our code

## Technologies used
- Front End
    - HTML
    - CSS (Twitter Bootstrap)
    - JavaScript (AngularJS)
    - NodeJS with Ruby
    - Yeoman
    - Grunt
- Back End
    - Rito Games API
    - MongoDB
- Repository
    - GitHub
- IDE
    - NetBeans

## Challenges Faced
- Time Constraint
    - We started on the project late (August 15) and took a week off to travel to NYC to watch LCS Finals and to Seattle for PAX (Aug 21 - Aug 30).
    - This gives us only effectively only 6 days to brainstorm ideas AND develop the code, while balancing school and work.
    - We still hope you find this site useful and insightful given slight incompleteness given our time constraints.
- Javascript Security
    - We wanted to automate the process of clicking on an itemset and it being directly downloaded to the correct location. However, we cannot require users to install/run our project.
        Javascript has no way of directly downloading to specific folders, unless the user specifies it. 
        We will therefore have to trust users to create a folder in the correct location and download the JSON file in the correct location.

## TODO (we have more cool ideas, but ran out of time)

- Champion Page
    - top half for most frequent
    - bottom half list best performing (kda, most win by summoner, etc)
- Summoner Page
    - search for specific champions played by specific players
    - KDA indicators (with W/L indicator)
    - search past the 10 most recent ranked games
- General additions
    - Build order breakdowns (early/mid/late) in addition to final build for summoners
    - other regions
- CSS (can always make it prettier)
- Documentation (can always have more of this)
