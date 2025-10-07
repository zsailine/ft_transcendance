"use strict";

const app = document.getElementById("app");

// Template page d’accueil
const homeHTML = `
  <div id="home" class="flex flex-col items-center justify-center space-y-6">
    <h1 class="text-5xl font-bold text-yellow-400 drop-shadow-lg">PONG</h1>
    <button id="startBtn"
      class="px-6 py-3 bg-yellow-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-all">
      START
    </button>
    <button id="tournament"
      class="px-6 py-3 bg-yellow-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-all">
      START TOURNAMENT
    </button>
  </div>
`;

app.innerHTML = homeHTML;


document.getElementById("tournament").addEventListener("click", async () => {
  const response = await fetch("tournament.html");
  const tournamentHTML = await response.text();
  app.innerHTML = tournamentHTML;
  const module = await import("./tournament.js");
  module.initTournament(); 
});


document.getElementById("startBtn").addEventListener("click", async () => {
  const response = await fetch("game.html");
  const gameHTML = await response.text();
  app.innerHTML = gameHTML;
  const gameModule = await import("./game.js");
  gameModule.initGame(app, homeHTML);
});