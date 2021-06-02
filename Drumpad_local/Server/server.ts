import * as WebSocket from "ws";

// // create WebSocket server with given port
const port: number = Number(process.env.PORT) || 8000;
const server: WebSocket.Server = new WebSocket.Server({ port: port });

// set of connected sockets
const clientSockets: Set<WebSocket> = new Set();

// init counters (0 is number of connected clients)
const counters: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

server.on("connection", (socket) => {
  console.log("connected");
  console.log("hello");
});