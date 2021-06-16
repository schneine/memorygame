"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
// // create WebSocket server with given port
const port = Number(process.env.PORT) || 8000;
const server = new WebSocket.Server({ port: port });
// set of connected sockets
const clientSockets = new Set();
// init counters (0 is number of connected clients)
let counter = 0;
server.on("connection", (socket) => {
    console.log("connected");
    console.log("hello world");
    if (counter < 2) {
        counter++;
        console.log("one user more", counter);
    }
    else {
        console.log("too many users");
    }
});
//# sourceMappingURL=server.js.map