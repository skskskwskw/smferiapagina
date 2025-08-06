// Clase para los fragmentos de código
class Codigo {
    constructor(x, y, texto, correcto) {
        this.x = x;
        this.y = y;
        this.texto = texto;
        this.correcto = correcto;
    }

    mover() {
        this.y += 2; // Velocidad de caída
    }

    dibujar(ctx) {
        ctx.fillStyle = this.correcto ? '#00ff00' : '#ff4444';
        ctx.fillRect(this.x, this.y, 80, 20);
        ctx.fillStyle = 'black';
        ctx.fillText(this.texto, this.x + 5, this.y + 15);
    }
}

// Clase para el juego
class Juego {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.collectSound = document.getElementById('collectSound');

        this.shipX = 180;
        this.shipY = 360;
        this.shipWidth = 40;
        this.goodCode = ['<div>', '{color:blue;}', 'function()'];
        this.badCode = ['<dog>', '++html', '@wrong'];

        this.fallingItems = [];
        this.score = 0;
        this.gameRunning = false;
        this.spawnInterval = null;

        // Variables del mini juego de estrellas
        this.juegoActivo = false;
        this.puntuacion = 0;
        this.estrella = document.getElementById("estrella");
        this.juegoArea = document.getElementById("juegoArea");
        this.puntuacionTexto = document.getElementById("puntuacion");

        // Manejo de eventos de teclado
        document.addEventListener('keydown', (e) => this.moverNave(e));

        // Vincular botones a métodos
        document.getElementById('startCodeGame').addEventListener('click', () => this.startGame());
        document.getElementById('stopCodeGame').addEventListener('click', () => this.stopGame());
        document.getElementById('exitCodeGame').addEventListener('click', () => this.exitGame());
        document.getElementById('startStarGame').addEventListener('click', () => this.iniciarJuego());
        document.getElementById('stopStarGame').addEventListener('click', () => this.detenerJuego());
        document.getElementById('exitStarGame').addEventListener('click', () => this.salirJuego());

        // Inicializar el cielo estrellado
        this.initStarfield();
    }

    initStarfield() {
        this.starfield = document.getElementById('starfield');
        this.starCtx = this.starfield.getContext('2d');

        this.starfield.width = window.innerWidth;
        this.starfield.height = window.innerHeight;

        this.stars = [];
        const numStars = 100; // Número de estrellas

        // Crear estrellas
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.starfield.width,
                y: Math.random() * this.starfield.height,
                radius: Math.random() * 2 + 1, // Tamaño de las estrellas
                speed: Math.random() * 0.5 + 0.1 // Velocidad de movimiento
            });
        }

        // Iniciar la animación del cielo estrellado
        this.animateStars();
    }

    drawStars() {
        this.starCtx.clearRect(0, 0, this.starfield.width, this.starfield.height);

        this.stars.forEach(star => {
            this.starCtx.beginPath();
            this.starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.starCtx.fillStyle = 'white';
            this.starCtx.fill();
        });
    }

    updateStars() {
        this.stars.forEach(star => {
            star.y += star.speed; // Mover la estrella hacia abajo
            if (star.y > this.starfield.height) {
                star.y = 0; // Reiniciar la estrella en la parte superior
                star.x = Math.random() * this.starfield.width; // Mover a una nueva posición horizontal
            }
        });
    }

    animateStars() {
        this.updateStars();
        this.drawStars();
        requestAnimationFrame(() => this.animateStars()); // Llamar a la función de animación
    }

    drawShip() {
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillRect(this.shipX, this.shipY, this.shipWidth, 20);
    }

    updateGame() {
        if (!this.gameRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawShip();

        for (let i = 0; i < this.fallingItems.length; i++) {
            let item = this.fallingItems[i];
            item.mover();
            item.dibujar(this.ctx);

            if (item.y + 20 >= this.shipY && item.x < this.shipX + this.shipWidth && item.x + 80 > this.shipX) {
                if (item.correcto) {
                    this.score++;
                    this.collectSound.currentTime = 0;
                    this.collectSound.play();
                }
                this.fallingItems.splice(i, 1);
                i--;
            } else if (item.y > this.canvas.height) {
                this.fallingItems.splice(i, 1);
                i--;
            }
        }

        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Puntaje: ' + this.score, 10, 20);
        requestAnimationFrame(() => this.updateGame());
    }

    spawnItem() {
        const isGood = Math.random() > 0.5;
        const text = isGood ? this.goodCode[Math.floor(Math.random() * this.goodCode.length)] : this.badCode[Math.floor(Math.random() * this.badCode.length)];

        this.fallingItems.push(new Codigo(Math.random() * (this.canvas.width - 80), 0, text, isGood));
    }

    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.fallingItems = [];
            this.score = 0;
            this.spawnInterval = setInterval(() => this.spawnItem(), 1000);
            this.updateGame();
        }
    }

    stopGame() {
        this.gameRunning = false;
        clearInterval(this.spawnInterval);
    }

    exitGame() {
        this.stopGame();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('¡Gracias por jugar!', 120, 200);
    }

    moverNave(e) {
        if (this.gameRunning) {
            if (e.key === 'ArrowLeft' && this.shipX > 0) {
                this.shipX -= 10; // Mover a la izquierda
            }
            if (e.key === 'ArrowRight' && this.shipX < this.canvas.width - this.shipWidth) {
                this.shipX += 10; // Mover a la derecha
            }
        }
    }

    // Funciones del mini juego de estrellas
    iniciarJuego() {
        if (this.juegoActivo) return;
        this.juegoActivo = true;
        this.puntuacion = 0;
        this.moverEstrella();
        this.estrella.style.display = "block";
    }

    detenerJuego() {
        this.juegoActivo = false;
        this.estrella.style.display = "none";
    }

    salirJuego() {
        this.detenerJuego();
        this.puntuacionTexto.textContent = "Puntos: 0";
        alert("Gracias por jugar");
    }

    moverEstrella() {
        if (!this.juegoActivo) return;
        const x = Math.random() * (this.juegoArea.clientWidth - 30);
        const y = Math.random() * (this.juegoArea.clientHeight - 30);
        this.estrella.style.left = `${x}px`;
        this.estrella.style.top = `${y}px`;

        setTimeout(() => this.moverEstrella(), 1000);
    }
}

// Inicializar el juego
const juego = new Juego();


// Abrir el modal
document.getElementById("btnInfoTecnica").onclick = function () {
    document.getElementById("modalInfo").style.display = "block";
}

// Cerrar el modal con la X
document.querySelector(".cerrar").onclick = function () {
    document.getElementById("modalInfo").style.display = "none";
}

// Cerrar haciendo clic fuera del contenido
window.onclick = function (event) {
    if (event.target == document.getElementById("modalInfo")) {
        document.getElementById("modalInfo").style.display = "none";
    }
}

function mostrarDisenoUI() {
    document.getElementById('modalDisenoUI').style.display = 'block';
}
function cerrarDisenoUI() {
    document.getElementById('modalDisenoUI').style.display = 'none';
}