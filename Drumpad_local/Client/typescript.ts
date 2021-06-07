

window.addEventListener("load", function(): void { 

const startButton: HTMLElement = document.getElementById("start");
const buttons: NodeListOf<HTMLDivElement> = document.querySelectorAll(".Taste");
console.log(buttons.length);

for (let button of buttons) {
    button.addEventListener("mousedown", onButton);
    console.log("adding");
    }
startButton.addEventListener("mousedown", () => playRandom([0, 1, 2, 3, 4, 5]));

//das Anfangsarray mit allen Tönen in der richtigen Reihenfolge der Melodie erstellen,  die ersten 7 Töne auf beliebige Tasten verteilen
//und automatisch in der richtigen Tonreihenfolge aufleuchten lassen (Display für Nutzer disabled)
//Nutzer kann Tasten nachdrücken, vergleich ob die 7 aufgeleuchteten Tasten mit den gedrückten Tasten des Nutzers übereinstimmen 
//wenn ja dann Töne in Ergebnisarry pushen und aus anfangsarray löschen, wenn falsch dann aus anfangsarray löschen 
//und in Ergebnisarray stille hinzufügen, wenn das Anfangsarray leer ist dann soll ergebnisarray abgespielt werden


/*window.addEventListener("load", function(){
    document.querySelector(".box1").addEventListener("mousedown", function(){playSample("A.mp3");});
    document.querySelector(".box2").addEventListener("mousedown", function(){playSample("F.mp3");});
    document.querySelector(".box3").addEventListener("mousedown", function(){playSample("hihat.mp3");});
    document.querySelector(".box4").addEventListener("mousedown", function(){playSample("kick.mp3");});
    document.querySelector(".box5").addEventListener("mousedown", function(){playSample("C.mp3");});
    document.querySelector(".box6").addEventListener("mousedown", function(){playSample("laugh-1.mp3");});
    document.querySelector(".box7").addEventListener("mousedown", function(){playSample("G.mp3");});
    document.querySelector(".box8").addEventListener("mousedown", function(){playSample("snare.mp3");});
    document.querySelector(".box9").addEventListener("mousedown", function(){playSample("laugh-2.mp3");});
    document.getElementById("#Tasten").addEventListener("mousedown", onButton);
});*/

function playSample(theMP3: string){
    var sound:HTMLAudioElement = new Audio("assets/" + theMP3);
    sound.play();

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
    const target: HTMLElement = <HTMLElement>evt.target;
    const index: number = parseInt(target.dataset.index);
    console.log("pressed Button");
   

    // highlight button
    target.classList.remove("hidden");
    target.classList.add("active");
    console.log(target.classList);
    setTimeout(() => {
        target.classList.remove("active");
        target.classList.add("hidden");

    } , 200);


    //evt.preventDefault(); // prevent mousedown emulation with iOS touch
  }
async function playRandom(order: number[]): Promise<void> {
      
      for (let i of order) {
          automaticButton(i);
          await new Promise(r => setTimeout(r,1000));
          
          //setInterval(() => automaticButton(i), 3000);
      }
  }



});

    


