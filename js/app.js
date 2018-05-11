let item = document.getElementsByClassName("grid-item");
let items = [...item]

const gameBoard = document.getElementById("grid-container");

let moves = 0;
let counter = document.querySelector(".moves");

let matchedItem = document.getElementsByClassName("matched");

let overlay = document.getElementById("overlay");

var openedItems = [];

document.body.onload = playMemory();

function shuffleItems(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var k = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[k];
    array[k] = temp;
  }
    
  return array;
}

function playMemory() {
  items = shuffleItems(items);
  for (var i = 0; i < items.length; i++){
    gameBoard.innerHTML = "";
    [].forEach.call(items, function(item) {
      gameBoard.appendChild(item);
    });
    items[i].classList.remove("flip", "flipped", "matched", "disabled");
  }
  resetGame();
}

function resetGame() {
  overlay.classList.remove("show");
  // reset move counter
  moves = 0;
  counter.innerHTML = moves;
  //reset timer
  second = 0;
  minute = 0; 
  hour = 0;
  var timer = document.querySelector(".timer");
  timer.innerHTML = "0 minute(s) 0 seconds";
  clearInterval(interval);
}

var displayItem = function () {
  this.classList.toggle("flip");
  this.classList.toggle("flipped");
  this.classList.toggle("disabled");
};

function itemOpen() {
  openedItems.push(this);
  var len = openedItems.length;
  if(len === 2){
    moveCounter();
    if(openedItems[0].innerHTML === openedItems[1].innerHTML){
      matched();
    } else {
      unmatched();
    }
  }
};

function matched(){
  openedItems[0].classList.add("matched", "disabled");
  openedItems[1].classList.add("matched", "disabled");
  openedItems[0].classList.remove("flip", "flipped", "no-event");
  openedItems[1].classList.remove("flip", "flipped", "no-event");
  openedItems = [];
}

function unmatched(){
  openedItems[0].classList.add("unmatched");
  openedItems[1].classList.add("unmatched");
  disable();
  setTimeout(function(){
    openedItems[0].classList.remove("flip", "flipped", "no-event","unmatched");
    openedItems[1].classList.remove("flip", "flipped", "no-event","unmatched");
    enable();
    openedItems = [];
  }, 1100);
}

function disable(){
  Array.prototype.filter.call(items, function(card){
    card.classList.add('disabled');
  });
}

function enable(){
  Array.prototype.filter.call(items, function(item){
    item.classList.remove('disabled');
    for(var i = 0; i < matchedItem.length; i++){
      matchedItem[i].classList.add("disabled");
    }
  });
}

function moveCounter(){
  moves++;
  counter.innerHTML = moves;
  if(moves == 1){
    second = 0;
    minute = 0; 
    hour = 0;
    startTimer();
  }
}

function youWon() {
  if (matchedItem.length == 16){
    clearInterval(interval);
    overlay.classList.add("show");
  };
}

var second = 0, minute = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
  interval = setInterval(function(){
    timer.innerHTML = minute+" minute(s) "+second+" seconds";
    second++;
    if(second == 60){
      minute++;
      second=0;
    }
  }, 1000);
}

for (var i = 0; i < items.length; i++){
  item = items[i];
  item.addEventListener("click", displayItem);
  item.addEventListener("click", itemOpen);
  item.addEventListener("click", youWon);
};
