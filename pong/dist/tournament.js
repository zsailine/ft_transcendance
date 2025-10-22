"use strict";
import { MainMenu } from "./index.js";
/** Mélange un tableau en place (algorithme de Fisher–Yates) */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
/** Lance un match entre deux joueurs et retourne le gagnant */
async function match(i, aliases) {
    const app = document.getElementById("app");
    if (!app)
        throw new Error("Element #app not found");
    app.innerHTML = "";
    const response = await fetch("game.html");
    const gameHTML = await response.text();
    app.innerHTML = gameHTML;
    const gameModule = await import("./tournamentGame.js");
    const rst = document.getElementById("rst");
    const backBtn = document.getElementById("backBtn");
    if (rst)
        rst.style.display = "none";
    if (backBtn)
        backBtn.style.display = "none";
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");
    if (player1)
        player1.textContent = aliases[i * 2];
    if (player2)
        player2.textContent = aliases[i * 2 + 1];
    const winner = await gameModule.initTournament();
    return winner;
}
async function startMatches(aliases) {
    const newAliases = [];
    const numMatches = Math.floor(aliases.length / 2);
    for (let i = 0; i < numMatches; i++) {
        const winner = await match(i, aliases);
        newAliases.push(winner);
    }
    return newAliases;
}
function displayWinner(aliases) {
    const app = document.getElementById("app");
    if (!app)
        throw new Error("Element #app not found");
    app.innerHTML = "";
    const overlay = document.createElement("div");
    overlay.id = "winnerOverlay";
    overlay.className = "fixed inset-0 flex flex-col items-center justify-center text-white z-50";
    const title = document.createElement("h2");
    title.textContent = `${aliases[0]} won the tournament!`;
    title.className = "text-4xl font-bold mb-6";
    const quitBtn = document.createElement("button");
    quitBtn.textContent = "Home";
    quitBtn.className =
        "px-6 py-3 bg-yellow-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-all";
    quitBtn.addEventListener("click", MainMenu);
    overlay.append(title, quitBtn);
    app.appendChild(overlay);
}
async function tournament(aliases) {
    while (aliases.length > 1) {
        const newAliases = await generateQualificationPhase(aliases);
        aliases = newAliases;
    }
    displayWinner(aliases);
}
async function generateQualificationPhase(aliases) {
    const numMatches = Math.floor(aliases.length / 2);
    const app = document.getElementById("app");
    if (!app)
        throw new Error("Element #app not found");
    app.innerHTML = "";
    const phaseContainer = document.createElement("div");
    phaseContainer.className = "flex flex-col items-center space-y-6 w-full";
    const title = document.createElement("h2");
    title.className = "text-2xl font-bold text-yellow-400 mb-4";
    phaseContainer.appendChild(title);
    for (let i = 0; i < numMatches; i++) {
        const matchDiv = document.createElement("div");
        matchDiv.className =
            "flex justify-center items-center space-x-4 bg-gray-800 p-3 rounded shadow w-1/2";
        const player1 = document.createElement("p");
        player1.textContent = aliases[i * 2];
        player1.className = "flex-1 text-center";
        const vs = document.createElement("p");
        vs.textContent = "VS";
        vs.className = "text-yellow-400 font-bold";
        const player2 = document.createElement("p");
        player2.textContent = aliases[i * 2 + 1];
        player2.className = "flex-1 text-center";
        matchDiv.append(player1, vs, player2);
        phaseContainer.appendChild(matchDiv);
    }
    const startButton = document.createElement("button");
    startButton.id = "start";
    startButton.textContent = "Start";
    startButton.className =
        "px-6 py-3 bg-yellow-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-all";
    phaseContainer.append(startButton);
    app.appendChild(phaseContainer);
    return new Promise((resolve) => {
        startButton.addEventListener("click", async () => {
            const newAliases = await startMatches(aliases);
            resolve(newAliases);
        });
    });
}
/** Point d’entrée : initialisation du formulaire et du tournoi */
export function initTournament() {
    const select = document.getElementById("players");
    const aliasesContainer = document.getElementById("aliasesContainer");
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("tournamentForm");
    if (!select || !aliasesContainer || !submitBtn || !form) {
        console.error("Missing required DOM elements for tournament initialization");
        return;
    }
    let aliasInputs = [];
    select.addEventListener("change", () => {
        const numPlayers = parseInt(select.value);
        aliasesContainer.innerHTML = "";
        aliasInputs = [];
        for (let i = 1; i <= numPlayers; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = `Alias du joueur ${i}`;
            input.className =
                "bg-white w-full rounded px-3 py-1 w-48 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400";
            input.required = true;
            aliasesContainer.appendChild(input);
            aliasInputs.push(input);
        }
        submitBtn.disabled = true;
    });
    aliasesContainer.addEventListener("input", () => {
        const aliases = aliasInputs.map((input) => input.value.trim());
        const uniqueAliases = new Set(aliases.filter((a) => a !== ""));
        const allFilled = aliases.every((alias) => alias !== "");
        const noDuplicates = uniqueAliases.size === aliases.length;
        const validLength = aliases.every((alias) => alias.length <= 12);
        aliasInputs.forEach((input) => {
            const alias = input.value.trim();
            if (alias.length > 12) {
                input.classList.add("ring-2", "ring-red-500");
                input.title = "Maximum 12 caractères";
            }
            else if (aliases.filter((a) => a === alias).length > 1 && alias !== "") {
                input.classList.add("ring-2", "ring-red-500");
                input.title = "Alias dupliqué";
            }
            else {
                input.classList.remove("ring-2", "ring-red-500");
                input.title = "";
            }
        });
        submitBtn.disabled = !(allFilled && noDuplicates && validLength);
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const aliases = aliasInputs.map((input) => input.value.trim());
        shuffleArray(aliases);
        tournament(aliases);
    });
}
