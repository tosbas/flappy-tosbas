const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 580;

if (window.innerWidth > 600) {
    canvas.width = 600;
    canvas.height = 600;
}

let messageBox = document.querySelector("#messageBox");
let bouton_start = document.querySelector("#bouton_start");

let image = new Image();

image.src = "flappy.png";

let start = false;

let frameFlappy = 250;

let score = 0;

function boutonAction() {

    // evenement sur le bouton
    bouton_start.addEventListener("click", () => {
        messageBox.classList.add("cacheText");
        start = true;
        flappyEvent();

    })

}

boutonAction();

let flappy_x = canvas.width / 2 - 30; //flappy axe x
let flappy_y = 10; //flappy axe y


function animerFlappy() {

    ctx.drawImage(image, 430, frameFlappy, 150, 150, flappy_x, flappy_y, 60, 60);

    // si le bouton est activer, alors flappy bird tombe
    if (start == true) {
        flappy_y += 1.2;
    }

    if (flappy_y > canvas.height || flappy_x + 30 >= pillier_x && flappy_y + 30 > pillier_y && flappy_x <= pillier_x + 150) {
        start = false;
        flappy_y = 100;
        messageBox.classList.remove("cacheText");
        messageBox.innerText = "Game Over !";
        messageBox.appendChild(bouton_start)
        bouton_start.innerText = "Rejouer ?";
        pillier_x = canvas.width;


        bouton_start.addEventListener("click", () => {
            start = true;
        })
    }
}

let pillier_x = canvas.width;
let pillier_y = randomNombre(50, 200);

function randomNombre(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function animerPillier() {
    ctx.drawImage(image, 110, 20, 300, 800, pillier_x, pillier_y, 300, 500);

    if (start == true) {
        pillier_x -= 2.5;
    }

    if (pillier_x < -180) {
        pillier_x = canvas.width;
        pillier_y = randomNombre(50, 400);


    }
}

// function globale qui affiche le background, pillier,sol et flappy bird

function drawImage() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(drawImage);

    // (image, source x, source y, source Largeur, source Hauteur, destination x, destination y, destination Largeur, destination Hauteur);

    // background
    ctx.drawImage(image, 750, 20, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    // pillier
    animerPillier();

    // sol
    ctx.drawImage(image, 100, 960, canvas.width, 30, 0, canvas.height - 50, canvas.width, 100);

    // flappy-bird
    animerFlappy();
}

drawImage();


function flappyEvent() {

    // sprite pour l'animation

    if (start == true) {
        setInterval(() => {
            if (frameFlappy == 250) {
                frameFlappy = 410;
            } else if (frameFlappy == 410) {
                frameFlappy = 250;
            }
        }, 100);
    }

}

// event pour chaque click, cela fait remonter flappy grace à la variable flappy_push

let flappy_push = -50; //force de pousse

canvas.addEventListener("click", () => {

    if (start == true) {
        flappy_y += flappy_push;

    }

})