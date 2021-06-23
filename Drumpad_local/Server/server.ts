import * as WebSocket from "ws";


// // create WebSocket server with given port
const port: number = Number(process.env.PORT) || 8000;
const server: WebSocket.Server = new WebSocket.Server({ port: port });

// set of connected sockets
const clientSockets: Set<WebSocket> = new Set();
let player1: WebSocket = null;
let player2: WebSocket = null; 

// init counters (0 is number of connected clients)

let gameStarted: boolean = false; 
let currentPlayer: number = -1;

function broadcast(message: string): void {
  if (player1 != null) {
    player1.send(message.toUpperCase());
  }
  
  if (player2 != null) {
player2.send(message.toUpperCase());   
} 
}

function startGame(): void {
  currentPlayer = Math.floor(Math.random()) + 1;
  if (currentPlayer == 1 ) {
    player1.send("play");
  }
  else {
    player2.send("play");
  }
}

server.on("connection", (socket) => {
  let playerNumber: number = 0; 
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
    broadcast(data.toString());
    
  });


  setInterval(() => broadcast("hello how are you?"), 5000);
});