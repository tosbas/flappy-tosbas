const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const messageBox = document.getElementById("messageBox");
const bouton_start = document.getElementById("bouton_start");

canvas.height = 600;


if(window.innerWidth > 800){
    canvas.width = 800;
}else{
    canvas.width = window.innerWidth;
}

window.addEventListener("resize", () => {

    if(window.innerWidth > 800){
        canvas.width = 800;
    }else{
        canvas.width = window.innerWidth;
    }
})




const image = new Image();
image.src = "flappy.png";

//************************************ Général *****************************************//

let start = false;
let score = 0;
let best_score = 0;
let sound = false;

//**************************************  flappy ******************************************//

class bird {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = width;
        this.height = height;
        this.pushDown = 0.1;
        this.pushLeft = 0.5;
        this.pushUp = 5;
        this.frame = 265;
    }
    draw() {
        ctx.drawImage(image, 430, this.frame, 150, 100, this.x, this.y, this.width, this.height);
    }
    method() {

        this.vy += this.pushDown;

        if (this.y > canvas.height - 20 - this.height ||
            this.x + this.width >= pipe.pipe1X && this.y + this.height >= pipe.pipe1Y && this.x <= pipe.pipe1X + pipe.pipe1W ||
            this.y <= -pipe.pipe2Y && this.x + this.width >= pipe.pipe2X && this.x < pipe.pipe2X + pipe.pipe2W) {
            start = false;
            score = 0;

            messageBox.classList.remove("cacheText");
            messageBox.textContent = "Game Over !";
            messageBox.appendChild(bouton_start);
            score = 0;

        }

        if (this.y <= 0) {
            this.vy += this.pushUp;
        }

        if (start) {
            this.y += this.vy;
        }


    }
}

const flappyBird = new bird(canvas.width / 2 - 12.5, canvas.height / 2 - 12.5, 25, 25);

//*********************************** areaGame ***********************************************//
class areaGame {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pushLeft = 5;
        this.pipe1X = this.x;
        this.pipe1Y = this.y;
        this.pipe1W = this.width;
        this.pipe1H = this.height;
        this.ecart = 100;
        this.pipe2X = this.x;
        this.pipe2Y = -this.pipe1Y + this.ecart;
        this.pipe2W = this.width;
        this.pipe2H = this.height;
    }
    draw() {

        ctx.drawImage(image, 100, 30, 200, 880, this.pipe1X, this.pipe1Y, this.pipe1W, this.pipe1H);
        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(image, 100, 30, 200, 800, this.pipe2X, this.pipe2Y, this.pipe2W, this.pipe2H);
        ctx.restore();

        //sol
        ctx.drawImage(image, 0, 950, canvas.width, 50, 0, canvas.height - 20, 960, 20);
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

const pipe = new areaGame(canvas.width + 300, minMaxNumber(180, 500), 80, 400);

//*********************************** function  ********************************************//


const gameLoop = () => {


    ctx.clearRect(0, 0, canvas.width, canvas.height);


    requestAnimationFrame(gameLoop);

    //background
    ctx.drawImage(image, 800, 0, 500, 1000, 0, 0, canvas.width, canvas.height);

    document.getElementById("score").innerText = score;
    localStorage.setItem("best_score", best_score);
    document.getElementById("best_score").innerText = best_score;

    flappyBird.draw();
    pipe.draw();

    if (pipe.pipe1X < 0 - pipe.pipe1W && pipe.pipe2X < 0 - pipe.pipe2W) {
        score++;

        if (score > best_score) {
            best_score++;
        }

        pipe.pipe1X = canvas.width + 300;
        pipe.pipe2X = canvas.width + 300;

        pipe.pipe1Y = minMaxNumber(180, 500);
        pipe.pipe2Y = -pipe.pipe1Y + pipe.ecart;
    }

    if (start) {
        flappyBird.method();
        pipe.method();
    }
}

gameLoop();

//*********************************** Game ********************************************//

bouton_start.addEventListener("click", () => {
    pipe.pushLeft = 5;
    flappyBird.vy = 0;
    flappyBird.y = canvas.height / 2;
    pipe.pipe1X = canvas.width + 300;
    pipe.pipe2X = canvas.width + 300;
    start = true;
    messageBox.classList.toggle("cacheText");
})

canvas.addEventListener("click", () => {

    if (start) {

        let audio = document.createElement("audio");
        document.querySelector("figure").appendChild(audio);
        if (sound == true) {
            audio.innerHTML = "<audio controls autoplay src = 'sound.mp3'>";
        }

        flappyBird.vy -= flappyBird.pushUp;
    }

})


setInterval(() => {
    if (start) {
        if (flappyBird.frame == 265) {
            flappyBird.frame = 425;
        } else if (flappyBird.frame == 425) {
            flappyBird.frame = 265;
        }
    }
}, 200);

setInterval(() => {
    if (start) {
        pipe.pushLeft += 0.1;
    }

}, 10000)

/*********************** bouton sound ********************************/

const container = document.getElementById("container");
const circle = document.getElementById("circle");

let i = 0;

container.addEventListener("click", () => {
    i++;

    if (i == 1) {
        circle.style.animation = "anime 1s forwards";
        circle.innerText = "on";
        sound = true;
    } else if (i == 2) {
        circle.style.animation = "anime2 1s forwards";
        circle.innerText = "off";
        i = 0;
        sound = false;
    }


})
