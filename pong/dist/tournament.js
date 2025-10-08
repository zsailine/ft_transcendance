"use strict";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];  
  }
}

async function match(i, aliases)
{
  const app = document.getElementById("app");
  app.innerHTML = "";
  const response = await fetch("game.html");
  const gameHTML = await response.text();
  app.innerHTML = gameHTML;
  const gameModule = await import("./tournamentGame.js");
  document.getElementById("rst").style.display = "none";
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("player1").innerHTML = aliases[i * 2];
  document.getElementById("player2").innerHTML = aliases[i * 2 + 1];
  console.log(`${aliases[i * 2]} vs ${aliases[i * 2 + 1]}`);
  const winner = await gameModule.initTournament();
  console.log("the winner is " , winner);
  return (winner);
}

async function startMatches(aliases)
{
  let newAliases= [];
  const numMatches = Math.floor(aliases.length / 2);
  console.log("number of match ", numMatches);
  for (let i = 0; i < numMatches; i++)
  {
    const winner = await match(i, aliases);
    newAliases.push(winner);
  }
  console.log("newAliases ", newAliases);
  return newAliases;
}

async function tournament(aliases) {
  console.log("aliases are ", aliases.length);

  while (aliases.length > 1) {
    let newAliases = await generateQualificationPhase(aliases);
    console.log("mivoaka");
    aliases = newAliases;
  }

  console.log("vita");
}

async function generateQualificationPhase(aliases)
{
  const numMatches = Math.floor(aliases.length / 2);
  if (numMatches === 0)
  {
    console.warn("Pas assez de joueurs pour une phase de qualification !");
    return;
  }

  const app = document.getElementById("app");
  app.innerHTML = "";

  const phaseContainer = document.createElement("div");
  phaseContainer.className = "flex flex-col items-center space-y-6 w-full";

  const title = document.createElement("h2");
  // title.textContent = "Match Listing";
  title.className = "text-2xl font-bold text-yellow-400 mb-4";
  phaseContainer.appendChild(title);

  for (let i = 0; i < numMatches; i++)
  {
    const matchDiv = document.createElement("div");
    matchDiv.className = "flex justify-center items-center space-x-4 bg-gray-800 p-3 rounded shadow w-1/2";

    const player1 = document.createElement("p");
    player1.textContent = aliases[i * 2];
    player1.className = "flex-1 text-center";

    const vs = document.createElement("p");
    vs.textContent = "VS";
    vs.className = "text-yellow-400 font-bold";

    const player2 = document.createElement("p");
    player2.textContent = aliases[i * 2 + 1];
    player2.className = "flex-1 text-center";

    matchDiv.appendChild(player1);
    matchDiv.appendChild(vs);
    matchDiv.appendChild(player2);
    phaseContainer.appendChild(matchDiv);
  }
  const startButton = document.createElement("button");
  startButton.id = "start";
  startButton.textContent = "Start";
  startButton.className = "px-3 py-1 mt-3 text-sm border border-gray-400 rounded hover:bg-gray-200 hover:text-gray-900 transition-all";
  phaseContainer.append(startButton);
  app.appendChild(phaseContainer);

  return new Promise((resolve) => {
    startButton.addEventListener("click", async () => {
      const newAliases = await startMatches(aliases);
      console.log("yo");
      resolve(newAliases);
    });
  });
}

export function initTournament() {
    const select = document.getElementById("players");
    const aliasesContainer = document.getElementById("aliasesContainer");
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("tournamentForm");

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
          "rounded px-3 py-1 w-48 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400";
        input.required = true;
        aliasesContainer.appendChild(input);
        aliasInputs.push(input);
      }

      submitBtn.disabled = true;
    });

    aliasesContainer.addEventListener("input", () => {
        const aliases = aliasInputs.map((input) => input.value.trim());
        const uniqueAliases = new Set(aliases.filter(a => a !== ""));
        const allFilled = aliases.every((alias) => alias !== "");
        const noDuplicates = uniqueAliases.size === aliases.length;    
        const validLength = aliases.every((alias) => alias.length <= 12);
        aliasInputs.forEach((input) =>{
            const alias = input.value.trim();
            if (alias.length > 12)
            {
                input.classList.add("ring-2", "ring-red-500");
                input.title = "Maximum 12 caractères";
            }
            else if ( aliases.filter((a) => a === alias).length > 1 &&
            alias !== "")
            {
                input.classList.add("ring-2", "ring-red-500");
                input.title = "Alias dupliqué";
            }
            else 
            {
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