    const ctx = document.getElementById("stars-background").getContext("2d");
    function randomMinMax(min, max) {
        return Math.random() * (max - min) + min;
    }
    function randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    let lastTime = 0;
    const targetFPS = 20;
    const frameDuration = 1000 / targetFPS;

    const stars = {
        element: document.getElementById("stars-background"),
        baseSpeed: 1,
        list: [],
        amount: window.innerWidth/2,
        colors: [
            "#ad03fc", //bright purple
            "#00eeff", //cyan
            "#ff00bf", //hot pink
            "#00c8ff", //sky blue
        ],

        update: function (time) {
            const delta = time - lastTime;
            if (delta >= frameDuration) {
                lastTime = time - (delta % frameDuration);
                stars.list.forEach((star) => {
                    star.y += stars.baseSpeed * star.speed.y;
                    star.x += stars.baseSpeed * star.speed.x;

                    // if (star.y > stars.element.height ||
                    //     star.x > stars.element.width
                    // ) {
                    //     star.x = randomMinMax(0, stars.element.width);
                    //     star.y = 0 - 100;
                    // }

                    if (star.y > stars.element.height) {
                        star.x = randomMinMax(0, stars.element.width);
                        star.y = 0 - 100;
                    }
                    if (star.x > stars.element.width) {
                        star.x = 0;
                    }
                    if (star.x < 0) {
                        star.x = stars.element.width;
                    }
                });
                stars.draw();
            }
            requestAnimationFrame(stars.update);
        },

        draw: function () {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, stars.element.width, stars.element.height);
            stars.list.forEach((star) => {
                const x = star.x;
                const y = star.y;
                const size = star.size * star.length;
                const altSize = size * star.thickness;
                ctx.lineWidth = 1;

                // ctx.beginPath();
                // ctx.moveTo(x, y);
                // ctx.arc(star.x, star.y, star.size / 4, 0, Math.PI * 2);
                // ctx.fillStyle = "#ff0000"
                // ctx.fill();

                ctx.beginPath();

                ctx.fillStyle = star.color;

                ctx.shadowColor = star.color + randomInt(0x00, 0xff).toString(16);
                ctx.shadowBlur = randomInt(9, 13);
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.moveTo(x, y - size); //top
                ctx.lineTo(x + altSize, y - altSize); // mid top right
                ctx.lineTo(x + size, y); // right
                ctx.lineTo(x + altSize, y + altSize); // mid bottom right
                ctx.lineTo(x, y + size); // bottom
                ctx.lineTo(x - altSize, y + altSize); // mid bottom left
                ctx.lineTo(x - size, y); // right
                ctx.lineTo(x - altSize, y - altSize); // mid top right
                ctx.lineTo(x, y - size); //top
                ctx.fill();
            });
        },
        init: function () {
            const size = () => 10 * randomMinMax(1, 3);
            const speed = () => {
                return {
                    x: 0,
                    y: 0,
                };
            };
            const thickness = () => randomMinMax(0.05, 0.2);
            for (let i = 0; i < stars.amount; i++) {
                const s = size();
                const sp = speed();
                sp.x = (s / 30) * 0.2;
                sp.y = (s / 30) * 0.4;

                stars.list.push(new Star(s, sp, thickness(), 0.2));
            }

            requestAnimationFrame(stars.update);
        },
    };

    class Star {
        constructor(size, speed, thickness = 0.2, length = 1.5) {
            this.size = size;
            this.speed = speed;
            this.defaultPos = {
                x: randomMinMax(0, stars.element.width),
                y: randomMinMax(0, stars.element.height),
            };
            this.x = this.defaultPos.x;
            this.y = this.defaultPos.y;
            this.thickness = thickness;
            this.length = length;
            this.color =
                stars.colors[randomInt(0, stars.colors.length - 1)] || "#fff";
        }
    }

    const lastDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    addEventListener("load", function () {
        stars.element.width = window.innerWidth;
        stars.element.height = window.innerHeight;
        stars.init();
    });
    addEventListener("resize", function () {
        if (window.innerWidth > lastDimensions.width)
            stars.element.width = window.innerWidth;
        if (window.innerHeight > lastDimensions.height)
            stars.element.height = window.innerHeight;
    });