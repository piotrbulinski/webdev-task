Keith's Matching Card Game
==========================

This is a simple game to test out some HTML / CSS / Javascript


NOTES
-----
- In an effort to keep this simple, I didn't use AngularJS or any other frameworks or libraries
- Due to a CORS issue (missing the Access-Control-Allow-Origin header server side) the app is currently defaulting to hard coded image urls


SETTINGS
--------
- Max Pairs: Can be defined in game.js
    + The API returns a random assortment of images, some of which are duplicates
    + The game filters out duplicates and creates pairs up to the max pairs amount

FUTURE TODOS
------------
- Extensive testing across multiple devices / platforms
- Improve animations and visuals (GreenSock Animation Library?)
- Performance updates (maybe promises, async/await)
- Debug CORS header issue
- Further code cleanup/refactoring