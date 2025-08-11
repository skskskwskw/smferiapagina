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
    constructor(x = 0, y = 0, w = 0, h = 0, speed = { x: 1, y: 1 }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
    }
}

class Pattern {
    constructor(object) {
        const { x, y, w, h, speed, amount } = object;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.amount = amount;
    }
    box() {
        return new Box(
            typeof this.x === "function" ? this.x() : this.x,
            typeof this.y === "function" ? this.y() : this.y,
            typeof this.w === "function" ? this.w() : this.w,
            typeof this.h === "function" ? this.h() : this.h,
            typeof this.speed === "function" ? this.speed() : this.speed
        );
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
    speed: 5,
    hitCooldown: false,
    invincibilityLength: 1000,
    x: asteroids.width / 2,
    y: asteroids.height,
    color: "#ffc400",
    hitboxRatio: 0.5,
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

const keys = {
    ArrowLeft: 0,
    ArrowRight: 0,
    ArrowDown: 0,
    ArrowUp: 0,
    Shift: 0,
};
function collide(a, b) {
    return (
        a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
}
function drawAsteroids(boxes) {
    actx.fillStyle = "#000";
    actx.fillRect(0, 0, asteroids.width, asteroids.height);

    //player
    actx.fillStyle = player.color;
    actx.fillRect(
        player.x - player.size / 2,
        player.y - player.size,
        player.size,
        player.size
    );
    if (keys["Shift"]) {
        //hitbox
        actx.fillStyle = "#0055ffff";
        actx.fillRect(
            player.x - (player.size * player.hitboxRatio) / 2,
            player.y - (player.size * (1 + player.hitboxRatio)) / 2,
            // player.x,
            // player.y,
            player.size * player.hitboxRatio,
            player.size * player.hitboxRatio
        );
    }
    actx.fillStyle = "#fff";
    boxes.forEach((box) => {
        actx.fillRect(box.x, box.y, box.w, box.h);
    });
}
let asteroidRun = false;

function normalizeVector(x, y) {
    const length = Math.sqrt(x * x + y * y);
    if (length === 0) return { x: 0, y: 0 };
    return { x: x / length, y: y / length };
}

function updateAsteroids() {
    if (!asteroidRun) return;

    const vect = normalizeVector(
        keys["ArrowRight"] - keys["ArrowLeft"],
        keys["ArrowDown"] - keys["ArrowUp"]
    );
    const mod = keys["Shift"] ? 3 : 1; //3 because divide by 3
    const pSpeed = {
        x: Math.abs(player.speed * vect.x) / mod,
        y: Math.abs(player.speed * vect.y) / mod,
    };

    if (keys["ArrowLeft"] && player.x - player.size / 2 > 0)
        player.x -= pSpeed.x;
    if (keys["ArrowRight"] && player.x + player.size / 2 < asteroids.width)
        player.x += pSpeed.x;
    if (keys["ArrowDown"] && player.y < asteroids.height) player.y += pSpeed.y;
    if (keys["ArrowUp"] && player.y - player.size > 0) player.y -= pSpeed.y;

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

        const hitbox = (() => {
            const { x, y, w, h } = player;
            return {
                x: x - (player.size * player.hitboxRatio) / 2,
                y: y - (player.size * (1 + player.hitboxRatio)) / 2,
                w: w * player.hitboxRatio,
                h: h * player.hitboxRatio,
            };
        })();

        if (collide(box, hitbox) && !player.hitCooldown) {
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

    const patterns = [];
    patterns.push(
        new Pattern({
            x: (() => {
                let x = 0;
                return function () {
                    return (x += 3);
                };
            })(),
            y: (() => {
                let y = 0;
                return function () {
                    return (y += 3);
                };
            })(),
            w: 10,
            h: 10,
            speed: () => ({
                x: 1,
                y: 1,
            }),
            amount: 50,
        })
    );

    patterns.push(
        new Pattern({
            x: () => randomMinMax(0, asteroids.width),
            y: 0,
            w: 10,
            h: 10,
            speed: () => ({
                x: randomMinMax(-1, 1) * 0.5,
                y: randomMinMax(1, 3) * 0.5,
            }),
            amount: 80,
        })
    );

    const pattern = patterns[randomInt(0, patterns.length-1)]
    console.log(pattern);
    
    for (let i = 0; i < pattern.amount; i++) {
        const box = pattern.box();
        console.log(box);
        boxes.push(box);
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
const diffSettings = document.querySelector("#catchstar .diff-settings");
const starLivesCounter = document.querySelector("#catchstar .lives");
const star = {
    size: 30,
    lives: 3,
    wait: 5000,
    decrease: 1,
    decMult: 1,
    difficulty: undefined,
    timer: undefined,
    diffs: 10,
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
};
starbox.appendChild(star.element);
let runStar = false;

star.element.addEventListener("click", () => {
    starUpdate();
});

function starUpdate() {
    console.log(star.wait);
    clearTimeout(star.timer);
    if (star.lives === 0) {
        starStop("Perdiste");
        return;
    }
    starLivesCounter.querySelector("span").textContent = star.lives;

    star.setPos({
        x: randomInt(0, starbox.offsetWidth),
        y: randomInt(0, starbox.offsetHeight),
    });

    star.wait =
        star.wait > 1000
            ? star.wait / (1 + star.decrease)
            : Math.max(
                  star.wait / 1 + star.decrease / 2,
                  Math.max(700 / (star.difficulty * 0.75), 250)
              );

    star.timer = setTimeout(() => {
        starUpdate();
        star.lives = Math.max(0, star.lives - 1);
    }, star.wait);
}

function starInit() {
    if (!star.difficulty) {
        alert("Por favor, elija una dificultad");
        return;
    }
    runStar = true;
    star.wait = Math.min(5000 / (star.difficulty / 2), 5000);
    star.decrease = 0.01 * star.difficulty;
    star.decMult = 1 + star.difficulty / 15;
    star.size = 20 / Math.max(1, star.difficulty / 5);
    star.element.style.width = star.size + "px";
    star.element.style.height = star.size + "px";

    starUpdate();
    star.element.style.display = "block";
    diffSettings.style.display = "none";
    starLivesCounter.style.display = "flex";
}
function starStop() {
    clearTimeout(star.timer);
    star.element.style.display = "none";
    diffSettings.style.display = "block";
    diffSettings.querySelector(".selected")?.classList.remove("selected");
    starLivesCounter.style.display = "none";
    reset(star, defStar);
}
star.setPos({
    x: randomInt(0, starbox.offsetWidth),
    y: randomInt(0, starbox.offsetHeight),
});

{
    const start = performance.now();
    const arr = new Array(star.diffs).fill(0);
    arr.forEach((e, i) => {
        const diff = document.createElement("div");
        diff.classList.add("diff");
        diff.innerHTML = `Dificultad: <span class="diff-n">${i + 1}</span>`;
        arr[i] = diff;
        diffSettings.appendChild(diff);
    });

    arr.forEach((e) => {
        e.addEventListener("click", function () {
            const start = performance.now();
            e.classList.add("selected");
            star.difficulty = parseInt(e.querySelector(".diff-n").textContent);
            arr.forEach((e2) => {
                if (e2 != e) e2.classList.remove("selected");
            });
            console.log("ms whole thing:", performance.now() - start);
        });
    });

    console.log("ms whole thing:", performance.now() - start);
}
