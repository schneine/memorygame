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
function broadcast(message) {
    if (player1 != null) {
        player1.send(message.toUpperCase());
    }
    if (player2 != null) {
        player2.send(message.toUpperCase());
    }
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
    }
    else {
        console.log("too many users");
    }
    socket.on("close", () => {
        if (playerNumber == 1) {
            console.log("player1 disconnected");
            player1 = null;
        }
        else if (playerNumber == 2) {
            console.log("player2 disconnected");
            player2 = null;
        }
    });
    socket.on("message", data => {
        console.log(data);
        broadcast(data.toString());
    });
    setInterval(() => broadcast("hello how are you?"), 5000);
});
//# sourceMappingURL=server.js.map