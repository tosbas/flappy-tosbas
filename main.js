const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const messageBox = document.getElementById("messageBox");
const bouton_start = document.getElementById("bouton_start");
const container = document.getElementById("container");
const circle = document.getElementById("circle");
const audio = document.getElementById("audio");
const scoreView = document.getElementById("score");
const best_scoreView = document.getElementById("best_score");


canvas.height = 600;
canvas.width = 800;

//Pipes conf
const PIPES_PUSH_LEFT = 5;

//Flappy conf
const FLAPPY_PUSH_UP = 4;
const FLAPPY_PUSH_DOWN = 0.1;


const image = new Image();
image.src = "flappy.png";

//************************************ Général *****************************************//

const flappyWidth = 25;
const flappyHeight = 25;
const flappyX = canvas.width / 2 - flappyWidth / 2;
const flappyY = canvas.height / 2 - flappyHeight / 2;

let start = false;
let scorePoint = 0;
let sound = false;

let best_scorePoint = 0;

if (localStorage.getItem("best_score")) {
    best_scorePoint = localStorage.getItem("best_score");
    best_scoreView.innerHTML = localStorage.getItem("best_score") + "m";
}
else {
    best_scoreView.innerHTML = best_scorePoint + "m";
}

if (localStorage.getItem("sound") == "true") {
    circle.style.animation = "anime 0s forwards";
    sound = true;
}



//**************************************  flappy ******************************************//

class bird {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = width;
        this.height = height;
        this.pushDown = FLAPPY_PUSH_DOWN;
        this.pushUp = FLAPPY_PUSH_UP;
        this.frame = 265;
    }
    draw() {
        ctx.drawImage(image, 430, this.frame, 150, 100, this.x, this.y, this.width, this.height);
    }
    method() {
        this.vy += this.pushDown;

        if (this.y <= 0) {
            this.vy = 0;
            this.vy += this.pushUp;
        }

        this.y += this.vy;

        if (this.y + this.height >= area.floorY ||
            this.x + this.width >= area.pipe1X &&
            this.y + this.height >= area.pipe1Y &&
            this.x <= area.pipe1X + area.pipe1W ||
            this.y <= -area.pipe2Y &&
            this.x + this.width >= area.pipe2X &&
            this.x < area.pipe2X + area.pipe2W
        ) {

            start = false;
            scorePoint = 0;

            messageBox.classList.remove("cacheText");
            messageBox.textContent = "Game Over !";
            messageBox.appendChild(bouton_start);
        }

        if (this.y + this.height >= area.floorY) {
            this.y = area.floorY - this.height;
        }
    }

    jump() {
        this.vy -= this.pushUp;
    }
}


const flappyBird = new bird(flappyX, flappyY, flappyWidth, flappyHeight);

//*********************************** areaGame ***********************************************//
class areaGame {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pushLeft = PIPES_PUSH_LEFT;
        this.pipe1X = this.x;
        this.pipe1Y = this.y;
        this.pipe1W = this.width;
        this.pipe1H = this.height;
        this.ecart = 100;
        this.pipe2X = this.x;
        this.pipe2Y = -this.pipe1Y + this.ecart;
        this.pipe2W = this.width;
        this.pipe2H = this.height;
        this.floorW = 960;
        this.floorH = 30;
        this.floorX = 0;
        this.floorY = canvas.height - this.floorH;
        this.colideBox = 7;
    }
    draw() {

        //Background
        ctx.drawImage(image, 800, 0, 500, 1000, 0, 0, canvas.width, canvas.height);

        //Pipe
        ctx.drawImage(image, 95, 35, 200, 880, this.pipe1X - this.colideBox, this.pipe1Y, this.pipe1W + this.colideBox, this.pipe1H);
        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(image, 95, 35, 200, 800, this.pipe2X - this.colideBox, this.pipe2Y, this.pipe2W + this.colideBox, this.pipe2H);
        ctx.restore();

        //sol
        ctx.fillRect(this.floorX, this.floorY, this.floorW, this.floorH)
        ctx.drawImage(image, 0, 950, canvas.width, 50, this.floorX, this.floorY, this.floorW, this.floorH);
    }
    method() {
        this.pipe1X -= this.pushLeft;
        this.pipe2X -= this.pushLeft;
    }
}

// function pour sortie un nombre aléatoire compris entre un minimum et un maximum
function minMaxNumber(min, max) {
    let value = Math.floor(Math.random() * (max - min)) + min;
    return value;
}

const area = new areaGame(canvas.width + 300, minMaxNumber(180, 500), 80, 400);
//*********************************** Game ********************************************//


const scoreViewing = () => {

    if (start) {
        scorePoint += 0.1;

        if (scorePoint > best_scorePoint) {
            best_scorePoint++;
        }

        localStorage.setItem("best_score", best_scorePoint);
        best_scoreView.innerHTML = localStorage.getItem("best_score") + "m";
    }

    const score = Math.round(scorePoint) + 'm';
    scoreView.innerText = score;
}

const gameLoop = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(gameLoop);

    area.draw();
    flappyBird.draw();


    if (start) {

        if (area.pipe1X < 0 - area.pipe1W && area.pipe2X < 0 - area.pipe2W) {

            area.ecart = minMaxNumber(100, 250);

            area.pipe1X = canvas.width + 300;
            area.pipe2X = canvas.width + 300;

            area.pipe1Y = minMaxNumber(180, 500);
            area.pipe2Y = -area.pipe1Y + area.ecart;
        }

        area.method();
        flappyBird.method();
    }

    scoreViewing();
}


//FlappyFrame
setInterval(() => {
    if (start) {
        if (flappyBird.frame == 265) {
            flappyBird.frame = 425;
        } else if (flappyBird.frame == 425) {
            flappyBird.frame = 265;
        }
    }
}, 200);

//Vitesse augmente toutes les 10s
setInterval(() => {
    if (start) {
        area.pushLeft += 0.1;
    }

}, 10000)

gameLoop();

/*********************** Event ********************************/

container.addEventListener("click", () => {

    if (localStorage.getItem("sound") == "true") {
        localStorage.setItem("sound", false);
        circle.style.animation = "anime2 1s forwards";
        sound = false;
    } else {
        localStorage.setItem("sound", true);
        circle.style.animation = "anime 1s forwards";
        sound = true;
    }
})

bouton_start.addEventListener("click", () => {
    area.pushLeft = PIPES_PUSH_LEFT;
    flappyBird.vy = 0;
    flappyBird.y = canvas.height / 2;
    area.pipe1X = canvas.width + 300;
    area.pipe2X = canvas.width + 300;
    start = true;
    messageBox.classList.toggle("cacheText");
})

canvas.addEventListener("click", () => {

    if (start) {

        if (sound == true) {
            audio.currentTime = 0
            audio.play();
        }

        flappyBird.jump();
    }

})
