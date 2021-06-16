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
    const buttons = document.querySelectorAll(".Taste");
    let buttonsPressed = [];
    let buttonOrder = [];
    let socket = new WebSocket("wss://guessalong.herokuapp.com/");
    socket.onopen = function () { socket.send(JSON.stringify("hello world")); };
    socket.onmessage = function (event) {
        console.log(event.data);
    };
    console.log(buttons.length);
    for (let button of buttons) {
        button.addEventListener("mousedown", onButton);
        console.log("adding");
    }
    startButton.addEventListener("mousedown", () => {
        randomButtonOrder(7);
        console.log(buttonOrder);
        playRandom(buttonOrder);
    });
    //das Anfangsarray mit allen Tönen in der richtigen Reihenfolge der Melodie erstellen,  die ersten 7 Töne auf beliebige Tasten verteilen
    //und automatisch in der richtigen Tonreihenfolge aufleuchten lassen (Display für Nutzer disabled)
    //Nutzer kann Tasten nachdrücken, vergleich ob die 7 aufgeleuchteten Tasten mit den gedrückten Tasten des Nutzers übereinstimmen 
    //wenn ja dann Töne in Ergebnisarry pushen und aus anfangsarray löschen, wenn falsch dann aus anfangsarray löschen 
    //und in Ergebnisarray stille hinzufügen, wenn das Anfangsarray leer ist dann soll ergebnisarray abgespielt werden
    //Durch Server kommunizieren welche Töne richtig oder falsch gespielt wurden (evtll. über String mit Tonnamen die richtig gespielt wurden)
    //Nach Melodieende die richtigen Töne für alle Spieler abspielen
    function playSound(song, counter) {
        var sound = new Audio("../assets/" + song + "/Marker" + counter + ".mp3");
        console.log("sound");
        sound.play();
    }
    function randomButtonOrder(n) {
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
    function automaticButton(index) {
        const target = buttons.item(index);
        target.classList.remove("hidden");
        target.classList.add("active");
        console.log(target.classList);
        setTimeout(() => {
            target.classList.remove("active");
            target.classList.add("hidden");
        }, 200);
    }
    function onButton(evt) {
        if (buttonsPressed.length >= buttonOrder.length) {
            console.log("finished pressing");
        }
        else {
            const target = evt.target;
            const index = parseInt(target.dataset.index);
            buttonsPressed.push(index);
            let numberOfPressedButtons = buttonsPressed.length;
            if (index == buttonOrder[numberOfPressedButtons - 1]) { //is the value of the button pressed (index) the same like given Order
                playSound("mamma_mia", numberOfPressedButtons);
            }
            console.log("pressed Button" + index);
            // highlight button
            target.classList.remove("hidden");
            target.classList.add("active");
            console.log(target.classList);
            setTimeout(() => {
                target.classList.remove("active");
                target.classList.add("hidden");
            }, 200);
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
        console.log(buttonsPressed);
        console.log(buttonOrder);
        if (arrayEquals(buttonsPressed, buttonOrder)) {
            console.log("correctOrder");
        }
        else {
            console.log("incorrectOrder");
        }
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