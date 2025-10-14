"use strict";
export async function MainMenu() {
    const app = document.getElementById("app");
    let response = await fetch("../home.html");
    const homeHTML = await response.text();
    app.innerHTML = homeHTML;
    async function goToMainMenu() {
        await MainMenu();
    }
    const tournamentBtn = document.getElementById("tournament");
    if (tournamentBtn) {
        tournamentBtn.addEventListener("click", async () => {
            const res = await fetch("../tournament.html");
            const tournamentHTML = await res.text();
            app.innerHTML = tournamentHTML;
            const module = await import("./tournament.js");
            if (typeof module.initTournament === "function") {
                module.initTournament();
            }
            else {
                console.error("initTournament() not found in tournament.js");
            }
        });
    }
    const startBtn = document.getElementById("startBtn");
    if (startBtn) {
        startBtn.addEventListener("click", async () => {
            const res = await fetch("../game.html");
            const gameHTML = await res.text();
            app.innerHTML = gameHTML;
            const gameModule = await import("./game.js");
            if (typeof gameModule.initGame === "function") {
                await gameModule.initGame(app, homeHTML, goToMainMenu);
            }
            else {
                console.error("initGame() not found in game.js");
            }
        });
    }
}
MainMenu();
