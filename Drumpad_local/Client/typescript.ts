

window.addEventListener("load", function(): void { 

const startButton: HTMLElement = document.getElementById("start");
const buttons: NodeListOf<HTMLDivElement> = document.querySelectorAll(".Taste");
let buttonsPressed: number[] = [];
let buttonOrder: number [] = [];
let url: string = "https://guessalong.herokuapp.com";
console.log(buttons.length);

for (let button of buttons) {
    button.addEventListener("mousedown", onButton);
    console.log("adding");
    }
startButton.addEventListener("mousedown", () => {
    randomButtonOrder(5);
    console.log(buttonOrder);
    playRandom(buttonOrder);
    
} );

//das Anfangsarray mit allen Tönen in der richtigen Reihenfolge der Melodie erstellen,  die ersten 7 Töne auf beliebige Tasten verteilen
//und automatisch in der richtigen Tonreihenfolge aufleuchten lassen (Display für Nutzer disabled)
//Nutzer kann Tasten nachdrücken, vergleich ob die 7 aufgeleuchteten Tasten mit den gedrückten Tasten des Nutzers übereinstimmen 
//wenn ja dann Töne in Ergebnisarry pushen und aus anfangsarray löschen, wenn falsch dann aus anfangsarray löschen 
//und in Ergebnisarray stille hinzufügen, wenn das Anfangsarray leer ist dann soll ergebnisarray abgespielt werden



function playSound(song: string, counter: number): void {
    var sound:HTMLAudioElement = new Audio("../assets/" + song + "/Marker" + counter + ".mp3");
    console.log("sound");
    sound.play();


}

function randomButtonOrder(n: number): void {
    for (let i: number = 0; i < n; i++) {
        while (true) {
            let value: number = Math.floor(Math.random() * (6));
            if (i == 0 || (i > 0 && value != buttonOrder[i - 1])) {
                buttonOrder.push(value);
                break;
            }
        }
        
        
    }
}



function automaticButton(index: number): void {
    const target: HTMLElement = <HTMLElement>buttons.item(index);
    target.classList.remove("hidden");
    target.classList.add("active");
    console.log(target.classList);
    setTimeout(() => {
        target.classList.remove("active");
        target.classList.add("hidden");

    } , 200);
}

function onButton(evt: Event): void {
    if (buttonsPressed.length >= buttonOrder.length) {
        console.log("finished pressing");
       
    }
    else {
        const target: HTMLElement = <HTMLElement>evt.target;
        const index: number = parseInt(target.dataset.index);

        buttonsPressed.push(index);
        let numberOfPressedButtons: number = buttonsPressed.length;
        if (index == buttonOrder[numberOfPressedButtons - 1]) {   //is the value of the button pressed (index) the same like given Order
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
    
        } 
        ,200);
        
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

    console.log(buttonsPressed);
    console.log(buttonOrder);
    
    
    if (arrayEquals(buttonsPressed, buttonOrder)) {
        console.log("correctOrder");
    } else {
        console.log("incorrectOrder");



    }

}





async function playRandom(order: number[]): Promise<void> {
      
      for (let i of order) {
          automaticButton(i);
          await new Promise(r => setTimeout(r,1000));
          
          //setInterval(() => automaticButton(i), 3000);
      }
  }



});

    


