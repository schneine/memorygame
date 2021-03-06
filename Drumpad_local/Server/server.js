"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
// // create WebSocket server with given port
const port = Number(process.env.PORT) || 8000;
const server = new WebSocket.Server({ port: port });
// set of connected sockets
const clientSockets = new Set();
let player1 = null;
let player2 = null;
// init counters (0 is number of connected clients)
let gameStarted = false;
let currentPlayer = -1;
let results = [];
function broadcast(message) {
    if (player1 != null) {
        player1.send(message);
    }
    if (player2 != null) {
        player2.send(message);
    }
}
function startGame() {
    results = []; //ausgelost wer anfängt
    currentPlayer = Math.floor(Math.random() * 2) + 1;
    if (currentPlayer == 1) {
        player1.send(results.length + "play");
        player2.send("wait");
    }
    else {
        player2.send(results.length + "play");
        player1.send("wait");
    }
}
function updateResults(a) {
    results = results.concat(a);
}
server.on("connection", (socket) => {
    let playerNumber = 0;
    console.log("connected");
    if (player1 == null) {
        console.log("player1 connected");
        player1 = socket;
        playerNumber = 1;
    }
    else if (player2 == null) {
        console.log("player2 connected");
        player2 = socket;
        playerNumber = 2;
        gameStarted = true;
        startGame();
    }
    else {
        console.log("too many users");
    }
    socket.on("close", () => {
        if (playerNumber == 1) {
            console.log("player1 disconnected");
            player1 = null;
            gameStarted = false;
        }
        else if (playerNumber == 2) {
            console.log("player2 disconnected");
            player2 = null;
            gameStarted = false;
        }
    });
    socket.on("message", data => {
        console.log(data);
        if (data == "player finished") {
            currentPlayer = currentPlayer == 1 ? 2 : 1; //changing the player
            if (currentPlayer == 1) {
                player1.send(results.length + "play");
                player2.send("wait");
            }
            else {
                player2.send(results.length + "play");
                player1.send("wait");
            }
        }
        else if (data == "End") {
            broadcast("End");
            broadcast(JSON.stringify(results));
        }
        else {
            try {
                let response = JSON.parse(data.toString()); //can we extract an array send from socket(client)
                console.log(response);
                updateResults(response);
            }
            catch (e) {
            }
        }
    });
    setInterval(() => broadcast("hello how are you?"), 5000);
});
//# sourceMappingURL=server.js.map