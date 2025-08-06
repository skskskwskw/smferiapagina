document.querySelectorAll(".dropdown").forEach((dp) => {
    dp.querySelector(".title").onclick = function () {
        dp.classList.toggle("open");
    };
});

const gameSelect = document.getElementById("game-select");
const gameSelectBtns = Array.from(gameSelect.querySelectorAll("button"));
const games = Array.from(document.getElementById("game-cont").children);

if (gameSelectBtns[0].classList.contains("selected")) {
    games[0].style.display = "block";
} else {
    games[0].style.display = "none";
}
if (gameSelectBtns[1].classList.contains("selected")) {
    games[1].style.display = "block";
} else {
    games[1].style.display = "none";
}

gameSelectBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
        btn.classList.add("selected");
        gameSelectBtns.forEach((e) => {
            if (e !== this) e.classList.remove("selected");
        });

        if (gameSelectBtns[0].classList.contains("selected")) {
            games[0].style.display = "block";
        } else {
            games[0].style.display = "none";
        }
        if (gameSelectBtns[1].classList.contains("selected")) {
            games[1].style.display = "block";
        } else {
            games[1].style.display = "none";
        }
    });
});
