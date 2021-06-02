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
    console.log(buttons.length);
    for (let button of buttons) {
        button.addEventListener("mousedown", onButton);
        console.log("adding");
    }
    startButton.addEventListener("mousedown", () => playRandom([0, 1, 2, 3, 4, 5]));
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
    function playSample(theMP3) {
        var sound = new Audio("assets/" + theMP3);
        sound.play();
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
        const target = evt.target;
        const index = parseInt(target.dataset.index);
        console.log("pressed Button");
        // highlight button
        target.classList.remove("hidden");
        target.classList.add("active");
        console.log(target.classList);
        setTimeout(() => {
            target.classList.remove("active");
            target.classList.add("hidden");
        }, 200);
        //evt.preventDefault(); // prevent mousedown emulation with iOS touch
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