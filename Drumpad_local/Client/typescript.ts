

window.addEventListener("load", function(): void { 

//const startButton: HTMLElement = document.getElementById("start");
const playerMessage: HTMLElement = document.getElementById("playermessage");
const buttons: NodeListOf<HTMLDivElement> = document.querySelectorAll(".Taste");
const background: HTMLElement = document.querySelector(".background");

let currentlyPlaying: boolean = false;
let buttonsPressed: number[] = [];
let buttonOrder: number [] = [];
let numberOfButtons: number = 4;
let songLength: number = 16;        //variable für Songlänge
let startingPart: number = 0;
let counterDisplay: HTMLSpanElement = document.getElementById("countdown");
let socket: WebSocket = new WebSocket("wss://guessalong.herokuapp.com/");
socket.onopen = function (): void {socket.send(JSON.stringify("hello world")); };
socket.onmessage = function (event: MessageEvent): void {
    console.log(event.data);
    if (event.data.includes("play")) {
        background.classList.remove("overlay");
        playerMessage.innerHTML = "It's your turn";
        currentlyPlaying = true;
        startingPart = parseInt(event.data, 10);
        console.log(startingPart);
        buttonOrder = [];
        buttonsPressed = [];
        randomButtonOrder(numberOfButtons);
        console.log(buttonOrder);
        startTimer();
        playRandom(buttonOrder);
        //currentlyPlaying = false;
    
    }

    else {
        try {
            let response: boolean [] = JSON.parse(event.data.toString());   //can we extract an array send from server
            console.log(response);
            playWholeMelody("mamma_mia", response);
    
        } catch (e) {}
    }
};
console.log(buttons.length);

for (let button of buttons) {
    button.addEventListener("mousedown", onButton);
    console.log("adding");
    }
/*startButton.addEventListener("mousedown", () => {
    
    if (currentlyPlaying) {
        buttonOrder = [];
        buttonsPressed = [];
        randomButtonOrder(numberOfButtons);
        console.log(buttonOrder);
        playRandom(buttonOrder);
        currentlyPlaying = false;
        
    }
    else {
        console.log("not your turn");
    }
} );*/

//Clients gehen Array results von Server durch, bei true = Ton abspielen, false = pause/ Stille, Töne sollten 
//nacheinander abgespielt werden und automatisch nachdem das "Spiel" zu Ende ist


function playSound(song: string, counter: number, fromStart: boolean): void {
    let index: number = fromStart ? counter : counter + startingPart;
    var sound: HTMLAudioElement = new Audio("../assets/" + song + "/Marker" + index + ".mp3");
    console.log("sound");
    sound.play();


}


function randomButtonOrder(n: number): void {
    buttonOrder = [];
    buttonsPressed = [];

    if (startingPart + n > songLength) {          //überprüfung ob Melodie zu Ende ist
        n = songLength - startingPart;
    }
    if (n > 0) {
        for (let i: number = 0; i < n; i++) {
            while (true) {
                let value: number = Math.floor(Math.random() * (6));
                if (i == 0 || (i > 0 && value != buttonOrder[i - 1])) {
                    buttonOrder.push(value);
                    break;
                }
            }
        }

    } else {
        socket.send("End");
    }
    
    console.log(buttonOrder.length + "/" + n);
}

interface Counter { 
    min: number; sec: number; 
}

function startTimer(): void {
    
    /*this.counter = { sec: 3 }; // choose whatever you want
    let intervalId: ReturnType<typeof setInterval> = setInterval(() => {
      if (this.counter.sec - 1 == -1) {
        this.counter.sec = 3;
      } 
      else this.counter.sec -= 1;
      if (this.counter.sec == 0) clearInterval(intervalId);
    }, 1000)
    counterDisplay.innerHTML = this.counter.sec;*/

    background.classList.add("overlay");
    
    /*for (let i: number = 3; i > 0; i--) {
        counterDisplay.innerHTML = i.toString();
        await new Promise(r => setTimeout(r, 400));
    }*/

    //now it should work

    let timeLeft: number = 3;
    let countdownTimer: ReturnType<typeof setInterval> = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
        }
        counterDisplay.innerHTML = timeLeft.toString();
        console.log(timeLeft);
        timeLeft -= 1;
        }, 500);

  }



function playWholeMelody(song: string, a: boolean[]): void {
    // load audio elements
    overlay();
    let allAudio: HTMLAudioElement[] = [];
    for (let i: number = 0; i < a.length; i++) {
        console.log("starting");
        if (a[i]) {
            // if the i-th button was pressed correctly (i.e. a at index i is true),
            // push the i-th sound file
            allAudio.push(new Audio("../assets/" + song + "/Marker" + (i + 1) + ".mp3"));
        } else {
            // if it was not correct, push a silent mp3 (currently: 750ms)
            allAudio.push(new Audio("../assets/silence.mp3"));
        }        
        console.log(allAudio[0]);
        if (i + 1 < a.length) {
            // if the audio added is not the last part, then specify that when it has
            // finished playing, the next audio element in the array is played
            allAudio[i].addEventListener("ended", () => {
                allAudio[i+1].play();
            });
        }
        
    }
    // start playing the first sound
    allAudio[0].play();
}

function overlay(): void {
    
    background.classList.add("overlay");
    playerMessage.id = "guess";
    playerMessage.innerHTML = "Guess the melody!";
    
    
}



/*function playWholeMelody(a: boolean []): void {
    for (let i: number = 0; i <= a.length; i++) {
     if (a[i] == true) {
     startingPart = 0;
     setTimeout(() => {
        playSound("mamma_mia", i, true);
     }, 2000);
     
} else {
    setTimeout(() => {
        console.log("pause");

    } 
    ,          200);
}
    }
}*/

function automaticButton(index: number): void {
    const target: HTMLElement = <HTMLElement>buttons.item(index);
    target.classList.remove("hidden");
    target.classList.add("active");
    console.log(target.classList);
    setTimeout(() => {
        target.classList.remove("active");
        target.classList.add("hidden");

    } ,        500);
}

function onButton(evt: Event): void {
    if (buttonsPressed.length >= buttonOrder.length) {
       
    }
    else {
        const target: HTMLElement = <HTMLElement>evt.target;
        const index: number = parseInt(target.dataset.index);

        buttonsPressed.push(index);
        let numberOfPressedButtons: number = buttonsPressed.length;
        if (index == buttonOrder[numberOfPressedButtons - 1]) {   //is the value of the button pressed (index) the same like given Order
            playSound("mamma_mia", numberOfPressedButtons, false);
        }
        

        
        console.log("pressed Button" + index);
        
       
    
        // highlight button
        target.classList.remove("hidden");
        target.classList.add("active");
        setTimeout(() => {
            target.classList.remove("active");
            target.classList.add("hidden");
    
        } 
        ,          500);
        
        if (buttonsPressed.length >= buttonOrder.length) {
            endOfTurn();
        }

        //evt.preventDefault(); // prevent mousedown emulation with iOS touch

    }

  }

function arrayEquals(a: number [], b: number []): boolean {    //untersucht ob gedrückte Tasten Array gleich ist wie die vorgegebene Reihenfolge (buttonOrder)
    if (a.length != b.length) {
        return false;                                          //wenn die Länge nicht gleich ist, dann kann es schon nicht gleich sein
    }
    else {
        return a.every(function(value: number, index: number): boolean {   //wenn die Länge gleich ist, dann untersuchen ob die gleichen Tasten gedrückt wurden
            return value == b [index]; 
        });
        
    }

}

function endOfTurn(): void {
    
    currentlyPlaying = false;
    
    if (arrayEquals(buttonsPressed, buttonOrder)) {
        console.log("correctOrder");
    } else {
        console.log("incorrectOrder");



    }
    background.classList.add("overlay");
    playerMessage.innerHTML = "now it's the other players turn";
    socket.send(JSON.stringify(correctKeys(buttonsPressed, buttonOrder)));
    socket.send("player finished");
    //console.log("difference", JSON.stringify(correctKeys(buttonsPressed, buttonOrder)));

}


function correctKeys (a: number [], b: number []): boolean [] {
let difference: boolean [] = [];
if (a.length != b.length) {
        //return false;                                         
    }
    else {
        a.forEach(function(value: number, index: number): void {   
           difference[index] = value == b [index]; 
        });
        
    }
return difference;
}


async function playRandom(order: number[]): Promise<void> {
      
      for (let i of order) {
          automaticButton(i);
          await new Promise(r => setTimeout(r, 1000));
          
          //setInterval(() => automaticButton(i), 3000);
      }
  }



});

    


