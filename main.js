const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 580;

if (window.innerWidth > 600) {
    canvas.width = 600;
    canvas.height = 600;
}

const messageBox = document.querySelector("#messageBox");
const bouton_start = document.querySelector("#bouton_start");

let score = document.querySelector("#score");
let best_score = document.querySelector("#best_score");



let scoreParse = parseInt("0");
best_score.innerText = scoreParse;

localStorage.setItem("BestScore", "0");
best_score.innerText = localStorage.getItem("BestScore", scoreParse);

score.innerText = 0;

const image = new Image();
image.src = "flappy.png";

let start = false;

bouton_start.addEventListener("click", () => {
    messageBox.classList.add("cacheText");
    start = true;
    pillier_x = canvas.width;

})

// **********************************************Globale**************************************************

// dessine dés de le départ le background et le sol

function drawImage() {
    requestAnimationFrame(drawImage)

    // background
    ctx.drawImage(image, 750, 300, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    // sol
    ctx.drawImage(image, 0, 950, canvas.width, 50, 0, 550, canvas.width, 50);

}

drawImage()

// **************************************************Pillier**************************************************

function returnRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

let pillier_y = returnRandomNumber(150, 500);
let pillier_x = canvas.width;

let pillier_bas = true;
let pillier_haut = false;

let speedInc = 1;

function drawPillier() {
    requestAnimationFrame(drawPillier)
    if (start == true) {

        pillier_x -= speedInc;

        ctx.drawImage(image, 110, 30, 200, 600, pillier_x, pillier_y, 200, 600);

        // je doit remettre le sol sinon le pillier passe devant
        ctx.drawImage(image, 0, 950, canvas.width, 50, 0, 550, canvas.width, 50);


        if (pillier_x < -200) {
            score.innerText++;
            if (score.innerText > scoreParse) {
                scoreParse += 1;
                localStorage.setItem("BestScore", scoreParse);

                best_score.innerText = localStorage.getItem("BestScore", scoreParse);
            }

            pillier_x = canvas.width;

            if (pillier_y > 0) {
                pillier_y = returnRandomNumber(-100, -400);
                pillier_haut = true;
                pillier_bas = false;

            } else if (pillier_y < 0) {
                pillier_y = returnRandomNumber(100, 500);
                pillier_bas = true;
                pillier_haut = false;

            }
        }
    }
}

drawPillier();

// **************************************************Flappy**************************************************

// frame de flappy

let frame = 265;

// function qui me permet de changer la frame tous les 150ms

function frameFlappy() {

    setInterval(() => {
        if (start == true) {

            if (frame == 265) {
                frame = 590
            } else if (frame == 590) {
                frame = 265;
            }
        }

    }, 150)

}

let flappy_x = 150;
let flappy_y = 100;

// function pour gérer les collisions
function collisionFlappy() {
    if (flappy_y > canvas.height || flappy_y < -30 || flappy_x + 50 > pillier_x && flappy_y + 30 > pillier_y && flappy_x + 40 < pillier_x + 230 && pillier_bas == true || flappy_x + 50 > pillier_x && flappy_y > pillier_y && flappy_y < pillier_y + 600 && flappy_x + 50 < pillier_x + 230 && pillier_haut == true) {

        start = false;
        GameOver();


    }

}


//function en attente, dés que start est égale à true alors flappy tombe est la frame de flappy change
function moveFlappy() {
    requestAnimationFrame(moveFlappy)
    if (start == true) {
        flappy_y += 1.2;
        setInterval(flappy_y += 0.2)
        frameFlappy();

    }
}

moveFlappy();

// function qui s'appelle elle-même, affichage de flappy

function drawFlappy() {
    requestAnimationFrame(drawFlappy)
        // sx,sy,sw,sh,dx,dy,dw,dh
    ctx.drawImage(image, 434, frame, 150, 150, flappy_x, flappy_y, 52, 60);

    if (start == true) {
        collisionFlappy();
    }

}


drawFlappy()


// event sur l'appuie souris pour remonter flappy
canvas.addEventListener("click", () => {
    if (start == true) {
        flappy_y -= 50;
    }

})

// *********************************************Game Over*******************************

function GameOver() {
    score.innerText = 0;
    flappy_x = 150;
    flappy_y = 100;
    speedInc = 1;
    pillier_y = returnRandomNumber(100, 500);
    messageBox.classList.remove("cacheText");
    messageBox.innerHTML = "Game Over<br>Rejouer ?";
    messageBox.appendChild(bouton_start);
}

setInterval(() => {
    speedInc += 0.1

}, 1000)