Card Memory Game
=====================

Overview
---------------------
This card memory game was built as a coding assessment for Thought Foundry.

Issues
---------------------
The major issue with this application is I could not create it on a server. For that reason I couldn't use AJAX to integrate with swagger.yml or easily contribute commits. I also saw that the assests requested from swagger.yml returned some broken urls, so the game includes movie images from google.

Understanding The Game
---------------------
When the game loads, it will by default put you into an easy game. To change the game mode, select a difficulty from the menu at the top right of the application.

This game functions like any other memory game, but with a few additional features.
- 4 game modes
- Time limits for each game mode
- Match size adjustment

Function Tree
---------------------
- Event listener for DOMContentedLoaded
	- loadCardFaces()
		- wait on game images to load before running loadGame()
			- loadGame(2,0)
- loadGame(match_size,difficulty)
	- resetGame()
		- clearNotification()
			- if notification exists, remove
		- clearTimer()
			- clear setInterval timer
		-	return game settings variables back to default values
		- reset timing on visual element
		- clear visual card table
	- setWindowSize()
		- load in window height and width into doc_size variable  
	- gameSetup(match_size,difficulty)
		- set game_settings.match_size to match_size
		- setDifficulty(difficulty)
			- set game_settings.difficulty to difficulty
			- set visual game mode element to active, color of active game mode comes from 'difficulty_color_scheme' variable
		- loadGameSettings()
			- set game_settings.stack_size, game_settings.cols, game_settings.rows
		- loadCardSize()
			- generate card size to fit screen
		- createCardStack()
			- loop over card_faces and insert into 'cards' x:match_size times. Insert location is random and found using recursive function insertIntoStack()
			- insertIntoStack()
		- createGameLayout()
			- adjust pre-defined HTML elements to fit the screen (main container, game controls, stack for dealing cards size)
		- placeCards()
			- create elements for each card and place in the card stack (where cards are dealt from)
			- each element is attached with an ontouchstart and onclick event that call playGame(this)
				- playGame(element)
					- this function controls all card functions:
						- check if card is ope, flipped, or game running is false and return false
						- if match fails, return cards to closed
						- if the difficulty is above medium and match fails, swapCards()
							- swapCards()
								- grab a random open card and swap it with a random closed card
						- open selected card and push to open card array
						- if cards match, keep flipped and add to flipped array
						- if flipped cards length matchs size of card stack, end game
							- clearTimer()
							- set game running status to false
							- notify('You Win!')
	- setupGame() called on 1ms delay
		- on a delay, move each card to its table position
		- when all card positions have been set, startGame()
		- startGame()
			- notify('Begin!')
			- when notification ends, set game running status to true and startTimer()
			- startTimer()
				- clearTimer()
					- ran in this location incase a new game is started while another game is running
				- set length of time for game from game_settings.timer.map[game_settings.difficulty]
				- setInterval that runs ever second to update game time and end game if time == 0
					- notify('Game Over!')
