var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener("load", function () {
    const startButton = document.getElementById("start");
    const playerMessage = document.getElementById("playermessage");
    const buttons = document.querySelectorAll(".Taste");
    let currentlyPlaying = false;
    let buttonsPressed = [];
    let buttonOrder = [];
    let numberOfButtons = 4;
    let songLength = 16; //variable für Songlänge
    let startingPart = 0;
    let socket = new WebSocket("wss://guessalong.herokuapp.com/");
    socket.onopen = function () { socket.send(JSON.stringify("hello world")); };
    socket.onmessage = function (event) {
        console.log(event.data);
        if (event.data.includes("play")) {
            playerMessage.innerHTML = "It's your turn";
            currentlyPlaying = true;
            startingPart = parseInt(event.data, 10);
            console.log(startingPart);
            buttonOrder = [];
            buttonsPressed = [];
            randomButtonOrder(numberOfButtons);
            console.log(buttonOrder);
            playRandom(buttonOrder);
            currentlyPlaying = false;
        }
        else {
            try {
                let response = JSON.parse(event.data.toString()); //can we extract an array send from server
                console.log(response);
                playWholeMelody(response);
            }
            catch (e) {
            }
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
    function playSound(song, counter, fromStart) {
        let index = fromStart ? counter : counter + startingPart;
        var sound = new Audio("../assets/" + song + "/Marker" + index + ".mp3");
        console.log("sound");
        sound.play();
    }
    function randomButtonOrder(n) {
        buttonOrder = [];
        buttonsPressed = [];
        if (startingPart + n > songLength) { //überprüfung ob Melodie zu Ende ist
            n = songLength - startingPart;
        }
        if (n > 0) {
            for (let i = 0; i < n; i++) {
                while (true) {
                    let value = Math.floor(Math.random() * (6));
                    if (i == 0 || (i > 0 && value != buttonOrder[i - 1])) {
                        buttonOrder.push(value);
                        break;
                    }
                }
            }
        }
        else {
            socket.send("End");
        }
        console.log(buttonOrder.length + "/" + n);
    }
    function playWholeMelody(a) {
        for (let i = 0; i <= a.length; i++) {
            if (a[i] == true) {
                startingPart = 0;
                setTimeout(() => {
                    playSound("mamma_mia", i, true);
                }, 2000);
            }
            else {
                setTimeout(() => {
                    console.log("pause");
                }, 200);
            }
        }
    }
    function automaticButton(index) {
        const target = buttons.item(index);
        target.classList.remove("hidden");
        target.classList.add("active");
        console.log(target.classList);
        setTimeout(() => {
            target.classList.remove("active");
            target.classList.add("hidden");
        }, 500);
    }
    function onButton(evt) {
        if (buttonsPressed.length >= buttonOrder.length) {
        }
        else {
            const target = evt.target;
            const index = parseInt(target.dataset.index);
            buttonsPressed.push(index);
            let numberOfPressedButtons = buttonsPressed.length;
            if (index == buttonOrder[numberOfPressedButtons - 1]) { //is the value of the button pressed (index) the same like given Order
                playSound("mamma_mia", numberOfPressedButtons, false);
            }
            console.log("pressed Button" + index);
            // highlight button
            target.classList.remove("hidden");
            target.classList.add("active");
            setTimeout(() => {
                target.classList.remove("active");
                target.classList.add("hidden");
            }, 500);
            if (buttonsPressed.length >= buttonOrder.length) {
                endOfTurn();
            }
            //evt.preventDefault(); // prevent mousedown emulation with iOS touch
        }
    }
    function arrayEquals(a, b) {
        if (a.length != b.length) {
            return false; //wenn die Länge nicht gleich ist, dann kann es schon nicht gleich sein
        }
        else {
            return a.every(function (value, index) {
                return value == b[index];
            });
        }
    }
    function endOfTurn() {
        if (arrayEquals(buttonsPressed, buttonOrder)) {
            console.log("correctOrder");
        }
        else {
            console.log("incorrectOrder");
        }
        playerMessage.innerHTML = "now it's the other players turn";
        socket.send(JSON.stringify(correctKeys(buttonsPressed, buttonOrder)));
        socket.send("player finished");
        //console.log("difference", JSON.stringify(correctKeys(buttonsPressed, buttonOrder)));
    }
    function correctKeys(a, b) {
        let difference = [];
        if (a.length != b.length) {
            //return false;                                         
        }
        else {
            a.forEach(function (value, index) {
                difference[index] = value == b[index];
            });
        }
        return difference;
    }
    function playRandom(order) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i of order) {
                automaticButton(i);
                yield new Promise(r => setTimeout(r, 1000));
                //setInterval(() => automaticButton(i), 3000);
            }
        });
    }
});
//# sourceMappingURL=typescript.js.map