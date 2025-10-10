"use strict";

export async function MainMenu()
{
  const app = document.getElementById("app");
  let response = await fetch("../home.html");
  const homeHTML = await response.text();
  app.innerHTML = homeHTML;
  
  async function goToMainMenu() {
    await MainMenu();
  }

  document.getElementById("tournament").addEventListener("click", async () => {
    response = await fetch("tournament.html");
    const tournamentHTML = await response.text();
    app.innerHTML = tournamentHTML;
    const module = await import("./tournament.js");
    module.initTournament(); 
  });
  
  
  document.getElementById("startBtn").addEventListener("click", async () => {
    response = await fetch("game.html");
    const gameHTML = await response.text();
    app.innerHTML = gameHTML;
    const gameModule = await import("./game.js");
    gameModule.initGame(app, homeHTML, goToMainMenu);
  });
}

MainMenu();