const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const messageBox = document.getElementById("messageBox");
const bouton_start = document.getElementById("bouton_start");

canvas.width = 300;
canvas.height = 450;

if (window.innerWidth > 600) {
    canvas.width = 580;
} else {
    canvas.width = 300;
}

const image = new Image();
image.src = "flappy.png";

/**************************************************************************** Général */

let start;
let score = 0;
let best_score = 0;
let pushLeft = 2;
let sound = false;

/******************************************************************************* flappy */

class bird {
    constructor(x, y, width, height, pushDown, pushUp, frame) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pushDown = 1.5;
        this.pushUp = 40;
        this.frame = 265;
    }
    draw() {
        ctx.drawImage(image, 430, this.frame, 150, 100, this.x, this.y, this.width, this.height);
    }
    method() {
        this.y += this.pushDown;

        if (this.y > canvas.height - 20 - this.height ||
            this.x + this.width >= pipe.x && this.y + this.height >= pipe.y && this.x <= pipe.x + pipe.width ||
            this.x + this.width >= pipe2.x && this.y > pipe2.y && this.y < pipe2.y + pipe2.height && this.x <= pipe2.x + pipe2.width) {
            start = false;
            score = 0;
        }

    }
}

const flappyBird = new bird(canvas.width / 2 - 12.5, canvas.height / 2 - 12.5, 25, 25);

/********************************************************************************* pipes */
class pipes {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {
    
        ctx.drawImage(image, 120, 40, 165, 860, this.x, this.y, this.width, this.height);
        //sol
        ctx.drawImage(image, 0, 950, canvas.width, 50, 0, canvas.height - 20, canvas.width, 20);
    }
    method() {
        this.x -= pushLeft;
    }
}

// function pour sortie un nombre aléatoire compris entre un minimum et un maximum
function minMaxNumber(min, max) {
    let value = Math.floor(Math.random() * (max - min)) + min;
    return value;
}

const pipe = new pipes(canvas.width + 300, minMaxNumber(180, 360), 100, 300);
const pipe2 = new pipes(canvas.width + 300, pipe.y - 400, 100, 300);

/****************************************************************************** function */

// dessine le décors
function drawStatiqueImage() {
    requestAnimationFrame(drawStatiqueImage);
    //background
    ctx.drawImage(image, 800, 0, 500, 1000, 0, 0, canvas.width, canvas.height);


    document.getElementById("score").innerText = score;
    localStorage.setItem("best_score", best_score);
    document.getElementById("best_score").innerText = best_score;

    // flappy
    flappyBird.draw();

    pipe.draw();
    pipe2.draw();

    if (pipe.x < 0 - pipe.width && pipe2.x < 0 - pipe2.width) {
        score++;
        if (score > best_score) {
            best_score++;
        }


        pipe.x = canvas.width;
        pipe2.x = canvas.width;

        pipe.y = minMaxNumber(180, 360);
        pipe2.y = pipe.y - 400;

    }
}

function colision() {

    if (start != false) {
        requestAnimationFrame(colision);
        flappyBird.method();
        pipe.method();
        pipe2.method();
        

    } else {
        messageBox.classList.remove("cacheText");
        messageBox.textContent = "Game Over !";
        messageBox.appendChild(bouton_start);
        score = 0;
    }
}

/****************************************************************************** Game */

drawStatiqueImage();

bouton_start.addEventListener("click", () => {
    flappyBird.y = canvas.height / 2;
    pipe.x = canvas.width + 300;
    pipe2.x = canvas.width + 300;
    start = true;
    pushLeft = 2;
    setInterval(()=>{
        pushLeft += 0.1;
    },20000)
    colision();
    messageBox.classList.toggle("cacheText");
    
})

canvas.addEventListener("click", () => {
    if (start == true) {
        if (flappyBird.y - flappyBird.height < 0) {
            flappyBird.y -= 0;
        } else {
            let audio = document.createElement("audio");
            document.querySelector("figure").appendChild(audio);
            if(sound == true){
                audio.innerHTML = "<audio controls autoplay src = 'sound.mp3'>";
            }
            
            flappyBird.y -= flappyBird.pushUp;
            setInterval(() => {
                if (flappyBird.frame == 265) {
                    flappyBird.frame = 425;
                } else if (flappyBird.frame == 425) {
                    flappyBird.frame = 265;
                }

            }, 500);

            
        }

    }

})

/****************************************************** bouton sound */

const container = document.getElementById("container");
const circle = document.getElementById("circle");

let i = 0;

container.addEventListener("click", ()=>{
      i++;
      
      if(i == 1){
        circle.style.animation ="anime 1s forwards";
        circle.innerText = "on";
        sound = true;
      }else if(i == 2){
        circle.style.animation ="anime2 1s forwards";
        circle.innerText = "off";
        i = 0;
        sound = false;
      }
      
      
})