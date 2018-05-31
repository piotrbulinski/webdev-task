'use strict';

var host = "https://devtask.t12y.net"

function loadStaticAssets() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(xhttp.responseText);
            setupGame(response);
        }
    };
    xhttp.open("GET", "static_assets.txt", true);
    xhttp.send();
}

function getAssets() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", host + "/assets", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(xhttp.responseText);
            setupGame(response);
        }
    };
    xhttp.onerror = function () {
        alert('Woops, there was an error making the request.');
    };
    xhttp.send();
}

function postResults(body) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", host + "/results", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function () {
        var response = JSON.parse(xhttp.responseText);
        var message = response["msg"];
        if (this.readyState === 4 && this.status === 200) {
            updateMessage(message);
        }
    };
    xhttp.onerror = function () {
        alert('Woops, there was an error making the request.');
    };
    xhttp.send(JSON.stringify(body));  
}