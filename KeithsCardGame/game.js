'use strict';

// Settings
var maxPairs = 5;

// Variables
var initialSetup = true;
var deck = [];
var flipped = [];
var matched = [];
var startTime = 0;
var timer;

// Audio
var matchSound;
var victorySound;

// Model
function Card(url, ind) {
    this.imgurl = url;
    this.index = ind;
    this.isFlipped = false;
    this.element;
}

// User Interaction: Clicked Index Play Button
function playButtonClicked() {
    showLoading();
    getAssets();
    if (initialSetup) {
        matchSound = new sound("bing.m4a");
        victorySound = new sound("oooyeah.m4a");
        initialSetup = false;
    }
}

function showLoading() {
    document.getElementById("game").innerHTML = "<div class=\"loader\"> <img src=\"loader.gif\" alt=\"Loading\"> </div>";
}

// Called From API Response
function setupGame(response) {
    var cards = buildCards(response);
    cards = shuffle(cards);
    buildHTML(cards);
    buildDeck(cards);
    updateMatchedMessage();
    startTime = new Date().getTime();
    clearInterval(timer);
    timer = setInterval(clockTick, 1000);
}

function buildCards(array) {
    var cards = [];
    var imageURLs = [];
    var cardIndex = 0;
    for (var i = 0; i < array.length && i < maxPairs; i++) {
        var imageURL = array[i];
        if (imageURLs.includes(imageURL) === false) {
            imageURLs.push(imageURL);
            cards.push(new Card(imageURL,cardIndex));
            cardIndex++;
            cards.push(new Card(imageURL,cardIndex));  
            cardIndex++; 
        }
    }
    return cards;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function buildHTML(array) {
    var cards = array;
    var html = "<div class=\"div-table\"> <div class=\"div-table-row\"> ";        
    for (var index = 0; index < cards.length; index++) { 
        var card = cards[index];
        html += "<div class=\"card\"> <img src=\"" + card.imgurl + "\" alt=\"Card\"> </div> ";
        if (index === array.length/2-1) {
                html += "</div> <div class=\"div-table-row\"> ";
        }
    } 
    html += "</div> </div> ";
    document.getElementById("game").innerHTML = html;
}

function buildDeck(array) {
    var cards = array;
    var elements = document.getElementsByClassName("card");
    for (var index = 0; index < cards.length; index++) { 
        var card = cards[index];
        card.element = elements[index];
        card.element.addEventListener("click",cardClicked);
        card.element.setAttribute("card_index",card.index);
    }
    deck = cards;
    flipped = [];
    matched = [];
}

function updateMatchedMessage() {
    var message = "Good Luck!";
    if (matched.length == deck.length) {
        message = "I guess you won. Woooo...."
    } else if (matched.length >= deck.length/2) {
        message = "Halfway there! How exciting....";
    } else if (matched.length > 0) {
        message = "You matched some - good for you....";
    }  
    updateMessage(message);
}

function updateMessage(message) {
    document.getElementById("message").innerHTML = message;
}

function clockTick() {
    if (startTime > 0) {
        document.getElementById("time").innerHTML = "Time's A Wastin - " + secondsSinceGameStarted() + " Seconds";
    }
}

function secondsSinceGameStarted() {
    var endTime = new Date().getTime();
    var timeElapsed = endTime - startTime;
    var wholeSeconds = Math.round(timeElapsed/1000);
    return wholeSeconds;
}

// User Interaction: Clicked On Card
function cardClicked() {
    var card = getCardForIndex(this.getAttributeNode("card_index").nodeValue);
    if (!card.isFlipped) {
        unflipBadMatch();
        flipCard(card);
        flipped.push(card);
        checkForMatch();
        updateMatchedMessage();
        checkForWin();
    }
}

function getCardForIndex(index) {
    for (var i=0; i < deck.length; i++) {
        var card = deck[i];
        if (card.index == index) {
            return card;
        }
    } 
}

function unflipBadMatch() {
    if (flipped.length == 2) {
        var card_a = flipped[0];
        var card_b = flipped[1];
        flipCard(card_a);
        flipCard(card_b);   
        flipped = [];
    }
}

function flipCard(card) {
    if (card.isFlipped) {
        card.element.classList.remove("flipped");
        card.element.classList.add("unflipped");
        card.isFlipped = false;
    } else {
        card.element.classList.remove("unflipped");
        card.element.classList.add("flipped");
        card.isFlipped = true;
    }
}

function checkForMatch() {
    if (flipped.length == 2) {
        var card_a = flipped[0];
        var card_b = flipped[1];
        if (card_a.imgurl === card_b.imgurl) {
            matched.push(card_a);
            matched.push(card_b);  
            flipped = [];
            matchSound.play();
        } 
    }
}

function checkForWin() {
    if (matched.length == deck.length) {
        clearInterval(timer);
        var endTime = new Date().getTime();
        var timeElapsed = endTime - startTime;
        var body = {time:timeElapsed};
        document.getElementById("time").innerHTML = "You finished in: " + secondsSinceGameStarted() + " Seconds";
        postResults(body);
        victorySound.play();
    }
}

// AUDIO

// Reference: https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
