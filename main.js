//---GLOBAL VARIABLES---
var doc_size = {x: null, y: null};

var card_faces = [
	'images/black_panther.jpg',
	'images/avengers_endgame.jpg',
	'images/boyhood.jpg',
	'images/hobbs_and_shaw.jpg',
	'images/pulp_fiction.jpg',
	'images/the_dark_knight.jpg',
	'images/thor_ragnarok.jpg',
	'images/toy_story_4.jpg'
];

var card_back_image = 'images/playing_card_back.png';

var difficulty_color_scheme = [
	'green',
	'orange',
	'red',
	'violet'
];

var cards = [];
var game_settings = {
	timer: {
		timer_obj: null,
		map: [
			60,
			40,
			45,
			120
		],
		current_time: 0
	},
	notification: null,
	running: false,
	difficulty: null,
	match_size: null,
	stack_size: null,
	cols: null,
	rows: null,
	card: {
		width: null,
		height: null,
		ratio: 1.4,
		padding: 10
	},
	in_game: {
		flipped_cards: [],
		open_cards: []
	}
};

//---GAME RUNNING FUNCTIONS---
//Check if all open cards match
function openCardsMatch() {
	var to_match = null;
	for (var i=0; i<game_settings.match_size; i++) {
		var matching = game_settings.in_game.open_cards[i].split('_')[2];
		if (to_match == null) {
			to_match = matching;
		} else if (matching != to_match) {
			return false;
		}
	}
	return true;
}

//Find a card this isn't open or flipped
function findClosedCard(random_open_card) {
	var random_card = Math.floor(Math.random()*game_settings.stack_size);
	var card_id = 'card_'+random_card+'_'+cards[random_card];
	if (!game_settings.in_game.open_cards.includes(card_id) && !game_settings.in_game.flipped_cards.includes(card_id) && card_id != random_open_card) {
		return card_id;
	}
	findClosedCard(random_open_card);
}

//In Hard or Insane, swap a random open card with a random closed card after a match has failed
function swapCard() {
	var random_open_num = Math.floor(Math.random()*game_settings.match_size);
	var random_open_card = game_settings.in_game.open_cards[random_open_num];
	var random_closed_card = findClosedCard(random_open_card);
	var f_card = document.getElementById(random_open_card);
	var s_card = document.getElementById(random_closed_card);
	var save_f_card_pos = {x: f_card.style.left, y: f_card.style.top};
	f_card.style.left = s_card.style.left;
	f_card.style.top = s_card.style.top;
	s_card.style.left = save_f_card_pos.x;
	s_card.style.top = save_f_card_pos.y;
}

//Onclick function of card
function playGame(card) {
	var parent_id = card.parentNode.id;
	if (game_settings.in_game.open_cards.includes(parent_id) || game_settings.in_game.flipped_cards.includes(parent_id) || game_settings.running === false) { //If card is open, flipped or game hasn't started, return false
		return false;
	}
	if (game_settings.in_game.open_cards.length == game_settings.match_size) { //If card match size is met on overflow click, return cards to previous state
		if (game_settings.difficulty > 1) { //If difficulty is above medium, swap one of the open cards to a random closed card
			swapCard();
		}
		for (var i=0; i<game_settings.match_size; i++) { //Return all open cards to closed state
			document.getElementById(game_settings.in_game.open_cards[i]).children[0].style.transform = 'rotateY(0deg)';
		}
		game_settings.in_game.open_cards = [];
	}
	card.style.transform = 'rotateY(180deg)'; //Open selected card
	game_settings.in_game.open_cards.push(parent_id);
	if (game_settings.in_game.open_cards.length == game_settings.match_size && openCardsMatch()) { //Re-check match size after push of new card, and check if all cards match
		game_settings.in_game.flipped_cards = game_settings.in_game.flipped_cards.concat(game_settings.in_game.open_cards); //flipped cards are matched cards
		game_settings.in_game.open_cards = [];
		if (game_settings.in_game.flipped_cards.length == game_settings.stack_size) { //All cards are flipped, end game
			clearTimer();
			game_settings.running = false;
			notify('#fff', '8vmin', 0, 'YOU WIN! <input class="notification_button" type="button" onclick="loadGame('+game_settings.match_size+','+game_settings.difficulty+');" value="Play Again?" />');
		}
	}
}

//Create a game notification
function notify(color,font_size,time,msg) {
	var notification = document.createElement('div');
	notification.id = 'game_notification';
	notification.innerHTML = msg;
	notification.style.color = color;
	notification.style.fontSize = font_size;
	notification.style.top = game_settings.card.height+(game_settings.card.padding*3)+'px';
	document.getElementById('main').appendChild(notification);
	if (time > 0) {
		game_settings.notification = setTimeout(function () {
			document.getElementById('game_notification').style.opacity = '0';
			setTimeout(function () {
				document.getElementById('game_notification').remove();
			},500);
		},time);
	}
}

//Load in primary game settings
function loadGameSettings() {
	game_settings.stack_size = card_faces.length*game_settings.match_size;
	game_settings.cols = Math.ceil(Math.sqrt(game_settings.stack_size));
	game_settings.rows = Math.ceil(game_settings.stack_size/game_settings.cols);
}

//Determine card sized based on screen height
function loadCardSize() {
	game_settings.card.height = doc_size.y/(game_settings.rows+1);
	game_settings.card.width = game_settings.card.height/game_settings.card.ratio;
	if (Math.round(game_settings.card.width) > (doc_size.x/game_settings.cols)-4) { //If card size based on height causes width overflow, adjust to fit
		game_settings.card.height *= ((doc_size.x/game_settings.cols)-game_settings.card.padding)/game_settings.card.width;
		game_settings.card.width = game_settings.card.height/game_settings.card.ratio; 
	}
}

//Function combo that randomly insterts cards into stack
function insertIntoStack(indx) {
	var stack_location = Math.floor(Math.random()*game_settings.stack_size);
	if (typeof cards[stack_location] === 'undefined') {
		cards[stack_location] = indx;
	} else {
		insertIntoStack(indx);
	}
}
function createCardStack() {
	for (var i=0; i<card_faces.length; i++) {
		for (var i2=0; i2<game_settings.match_size; i2++) {
			insertIntoStack(i);
		}
	}
}

//Manage pre-defined HTML in the 'game_controls' element
function createGameLayout() {
	var stack = document.getElementById('stack');
	stack.style.height = game_settings.card.height-game_settings.card.padding+'px';
	stack.style.width = game_settings.card.width-game_settings.card.padding+'px';
	stack.style.left = game_settings.card.padding+'px';
	stack.style.top = game_settings.card.padding+'px';
	var game_controls = document.getElementById('game_controls');
	game_controls.style.left = game_settings.card.width+game_settings.card.padding+'px';
	game_controls.style.top = game_settings.card.padding+'px';
	game_controls.style.width = (game_settings.card.width*game_settings.cols)-(game_settings.card.width+game_settings.card.padding)+'px';
	var main = document.getElementById('main');
	main.style.width = (game_settings.card.width*game_settings.cols)+game_settings.card.padding+'px';
	main.style.height = doc_size.y+game_settings.card.padding+'px';
}

//Create card elements
function placeCards() {
	var card_table = document.getElementById('card_table');
	for (var i=0; i<game_settings.stack_size; i++) {
		var temp_card = document.createElement('div');
		temp_card.className = 'card';
		temp_card.id = 'card_'+i+'_'+cards[i];
		temp_card.style.height = game_settings.card.height-game_settings.card.padding+'px';
		temp_card.style.width = game_settings.card.width-game_settings.card.padding+'px';
		temp_card.style.left = game_settings.card.padding+'px';
		temp_card.style.top = game_settings.card.padding+'px';
		temp_card.innerHTML = '<div class="flip-card-inner" ontouchstart="playGame(this);" onclick="playGame(this);"><div class="flip-card-front"><img src="'+card_back_image+'" /></div><div class="flip-card-back"><img src="'+card_faces[cards[i]]+'" /></div></div>';
		card_table.appendChild(temp_card);
	}
}

//Clear and remove game notification
function clearNotification() {
	clearTimeout(game_settings.notification);
	var notification = document.getElementById('game_notification');
	if (notification) {
		notification.remove();
	}
}

//Clear game timer
function clearTimer() {
	clearInterval(game_settings.timer.timer_obj);
}

//Start game timer
function startTimer() {
	clearTimer(); //Add a clear timer for when a new game is initialized during a current game
	game_settings.timer.current_time = game_settings.timer.map[game_settings.difficulty];
	document.getElementById('time_remaining').innerHTML = game_settings.timer.current_time+'s';
	game_settings.timer.timer_obj = setInterval(function() {
		game_settings.timer.current_time--;
		document.getElementById('time_remaining').innerHTML = game_settings.timer.current_time+'s';
		if (game_settings.timer.current_time == 0) { //Check if game has ended
			clearTimer();
			game_settings.running = false;
			notify('#fff', '8vmin', 0, 'GAME OVER! <input class="notification_button" type="button" onclick="loadGame('+game_settings.match_size+','+game_settings.difficulty+');" value="Try Again?" />');
		}
	},1000);
}

//Function to finalize a game start
function startGame() {
	notify('#fff', '8vmin', 1500, 'BEGIN!');
	setTimeout(function () { game_settings.running = true; startTimer(); }, 1500);
}

//Once a game has been created, place cards on the table
function setupGame() {
	var base_top = game_settings.card.height;
	var card_index = 0;
	for (var i=0; i<game_settings.rows; i++) {
		for (var i2=0; i2<game_settings.cols; i2++) {
			(function(card_index) {
				var indx = card_index;
				var table_card = document.getElementById('card_'+card_index+'_'+cards[card_index]);
				var xp = i2;
				var yp = i;
				setTimeout(function() {
					table_card.style.left = game_settings.card.padding+(xp*game_settings.card.width)+'px';
					table_card.style.top = base_top+game_settings.card.padding+(yp*game_settings.card.height)+'px';
					if (indx == game_settings.stack_size-1) {
						startGame();
					}
				}, card_index*((16/game_settings.stack_size)*100));
			}(card_index));
			card_index++;
			if (card_index == game_settings.stack_size) {
				break;
			}
		}
	}
}

//Set game difficulty and change the game type selector
function setDifficulty(difficulty) {
	game_settings.difficulty = difficulty;
	for (var i=0; i<4; i++) {
		if (i == difficulty) {
			document.getElementById('diff_'+i).style.color = difficulty_color_scheme[difficulty];
			document.getElementById('difficulty').style.borderBottom = '2px solid '+difficulty_color_scheme[difficulty];
		} else {
			document.getElementById('diff_'+i).style.color = '#333';
		}
	}
}

//Setup game variables
function gameSetup(ms,difficulty) {
	game_settings.match_size = ms;
	setDifficulty(difficulty);
	loadGameSettings();
	loadCardSize();
	createCardStack();
	createGameLayout();
	placeCards();
}

//Load in client window size
function setWindowSize() {
	doc_size.x = window.innerWidth;
	doc_size.y = window.innerHeight-game_settings.card.padding;
}

//Reset all dynamic game elements and variables
function resetGame() {
	clearNotification();
	clearTimer();
	document.getElementById('time_remaining').innerHTML = '0s';
	cards = [];
	game_settings.running = false;
	game_settings.in_game = {
		flipped_cards: [],
		open_cards: []
	};
	document.getElementById('card_table').innerHTML = '';
}

//Start the initialization of a new game, paramteres(match size, difficulty)
function loadGame(ms,difficulty) {
	resetGame();
	setWindowSize();
	gameSetup(ms,difficulty);
	setTimeout(function() { setupGame(); },1);
}

//Load images before running initial loadGame
var loaded_cards = 0;
function loadCardFaces() {
	for (var i=0; i<=card_faces.length; i++) {
		var img = new Image;
		img.onload = function () {
			loaded_cards++;
			console.log(loaded_cards);
			if (loaded_cards == card_faces.length+1) {
				loadGame(2,0);
			}
		};
		img.src = (i < card_faces.length ? card_faces[i] : card_back_image);
	}
}

//On load of the document, load an initial game
document.addEventListener('DOMContentLoaded', function() {
	loadCardFaces();
});