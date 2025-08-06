function randomMinMax(min, max) {
    return Math.random() * (max - min) + min;
}
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//asteroids
const asteroids = document.getElementById("asteroids-canvas");
const actx = asteroids.getContext("2d");
class Box {
    constructor(x, y, w, h, speed = { x: 1, y: 1 }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
    }
}

const boxes = [];
const livesCounter = document.querySelector(
    "#asteroids .game-place .lives span"
);
const asteroidScore = document.querySelector(
    "#asteroids .game-place .score span"
);
const message = document.querySelector("#asteroids .game-place .message");
const player = {
    lives: 3,
    size: 10,
    speed: 0.1,
    hitCooldown: false,
    invincibilityLength: 500,
    x: asteroids.width / 2,
    y: asteroids.height,
    color: "#ffc400",
};
livesCounter.textContent = player.lives;
asteroidScore.textContent = 0;
player._copy = structuredClone(player);
function reset(og, copy) {
    for (const [key, value] of Object.entries(copy)) {
        og[key] = value;
    }
}
player.w = player.size;
player.h = player.size;

const amount = 20;
const keys = {};
function collide(a, b) {
    return (
        a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
}
function drawAsteroids(boxes) {
    actx.fillStyle = "#000";
    actx.fillRect(0, 0, asteroids.width, asteroids.height);

    actx.fillStyle = "#fff";

    boxes.forEach((box) => {
        actx.fillRect(box.x, box.y, box.w, box.h);
    });

    actx.fillStyle = player.color;
    actx.fillRect(
        player.x - player.size / 2,
        player.y - player.size,
        player.size,
        player.size
    );
}
let asteroidRun = false;
function updateAsteroids() {
    if (!asteroidRun) return;
    boxes.forEach((box) => {
        box.x += box.speed.x;
        box.y += box.speed.y;

        if (box.y > asteroids.height) {
            box.x = randomMinMax(0, asteroids.width);
            box.y = 0 - 100;
        }
        if (box.x > asteroids.width) {
            box.x = 0;
        }
        if (box.x < 0) {
            box.x = asteroids.width;
        }

        if (player.y > asteroids.height) player.y = 0 + player.size;
        if (player.y < 0) player.y = asteroids.height - player.size;
        if (player.x > asteroids.width) player.x = 0 + player.size / 2;
        if (player.x < 0) player.x = asteroids.width - player.size / 2;

        const pSpeed = keys["Shift"] ? player.speed / 2 : player.speed;

        if (keys["ArrowLeft"]) player.x -= pSpeed;
        if (keys["ArrowRight"]) player.x += pSpeed;
        if (keys["ArrowDown"]) player.y += pSpeed;
        if (keys["ArrowUp"]) player.y -= pSpeed;

        if (collide(box, player) && !player.hitCooldown) {
            console.log("decreased");
            player.lives = Math.max(0, player.lives - 1);
            player.hitCooldown = true;
            setTimeout(
                () => (player.hitCooldown = false),
                player.invincibilityLength
            );
            livesCounter.textContent = player.lives;

            if (player.lives <= 0) {
                stopAsteroids("Perdiste");
                return;
            }
        }

        asteroidScore.textContent = parseInt(asteroidScore.textContent) + 1;
    });

    drawAsteroids(boxes);
    requestAnimationFrame(updateAsteroids);
}

function initAsteroids() {
    if (asteroidRun) return;
    message.textContent = "";
    livesCounter.textContent = player.lives;
    for (let i = 0; i < amount; i++) {
        boxes.push(
            new Box(randomInt(0, asteroids.width), -100, 15, 15, {
                x: randomMinMax(-1, 1),
                y: randomMinMax(1, 3),
            })
        );
    }
    requestAnimationFrame(updateAsteroids);
    asteroidRun = true;
}
function stopAsteroids(m = "") {
    asteroidRun = false;
    actx.fillStyle = "#000";
    actx.fillRect(0, 0, asteroids.width, asteroids.height);
    while (boxes.length) {
        boxes.pop();
    }
    reset(player, player._copy);

    message.textContent = m;
    asteroidScore.textContent = 0;
}

addEventListener("keydown", function (e) {
    if (
        asteroidRun &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
    ) {
        e.preventDefault();
    }
    keys[e.key] = true;
});

addEventListener("keyup", function (e) {
    keys[e.key] = false;
});

//estrella

const starbox = document.getElementById("star-box");
const star = {
    size: 10,
    lives: 3,
    wait: 5000,
    decrease: 0.95,
    decMult: 1
};
const defStar = structuredClone(star);

star.element = (function () {
    console.log(this);
    const star = document.createElement("div");
    star.classList.add("star");
    return star;
})();

star.setPos = function (pos) {
    star.element.style.left = Math.max(pos.x - star.size, 0) + "px";
    star.element.style.top = Math.max(pos.y - star.size, 0) + "px";
}
starbox.appendChild(star.element);
star.element.style.width = star.size + "px";
star.element.style.height = star.size + "px";
star.element.addEventListener("click", () => {
    star.setPos({
        x: randomInt(0, starbox.offsetWidth),
        y: randomInt(0, starbox.offsetHeight)
    })
})
let runStar = false;


function starUpdate() {
    star.setPos({
        x: randomInt(0, starbox.offsetWidth),
        y: randomInt(0, starbox.offsetHeight)
    })
    star.wait *= star.decrease
    star.decrease *= star.decMult
}

function starInit(difficulty) {

    runStar = true;

    setTimeout()

    star.element.style.display = "block";
    star.setPos({
        x: randomInt(0, starbox.offsetWidth),
        y: randomInt(0, starbox.offsetHeight)
    })
}
function starStop() {
    star.element.style.display = "none";
    reset(star, defStar);
}
star.setPos({
    x: randomInt(0, starbox.offsetWidth),
    y: randomInt(0, starbox.offsetHeight)
})




