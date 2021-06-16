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
let counter = 0;
function broadcast(message) {
    if (player1 != null) {
        player1.send(message.toUpperCase());
    }
    if (player2 != null) {
        player2.send(message.toUpperCase());
    }
}
server.on("connection", (socket) => {
    console.log("connected");
    if (counter < 2) {
        counter++;
        console.log("one user more", counter);
        if (counter == 1) {
            player1 = socket;
        }
        else {
            player2 = socket;
        }
    }
    else {
        console.log("too many users");
    }
    socket.on("message", data => {
        console.log(data);
        broadcast(data.toString());
    });
    setInterval(() => broadcast("hello how are you?"), 5000);
});
//# sourceMappingURL=server.js.map