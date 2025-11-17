import React, { useState, useMemo } from 'react';
import { useContext } from "react";
import { UserContext } from "../../../Providers/TournamentProvider"

function shuffleArray(array: string[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

interface ValidationErrors {
  [key: number]: string;
}

export default function TournamentForm() {
  const [numPlayers, setNumPlayers] = useState<string>("");
  const { aliases, setAliases } = useContext(UserContext);
  const { setPages } = useContext(UserContext);
  const validation = useMemo(() => {
    const errors: ValidationErrors = {};
    const trimmedAliases = aliases.map(a => a.trim());

    let allFilled = true;
    let noDuplicates = true;
    let validLength = true;

    if (aliases.length === 0) {
      allFilled = false;
    }

    trimmedAliases.forEach((alias, index) => {
      if (alias === "") {
        allFilled = false;
      }
      if (alias.length > 12) {
        validLength = false;
        errors[index] = "Maximum 12 caractères";
      }
      else if (alias !== "" && trimmedAliases.filter(a => a === alias).length > 1) {
        noDuplicates = false;
        errors[index] = "Alias dupliqué";
      }
    });

    const isSubmitDisabled = !(allFilled && noDuplicates && validLength);;
    return { errors, isSubmitDisabled };

  }, [aliases]);


  const handlePlayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value) || 0;
    setNumPlayers(e.target.value);
    setAliases(Array(count).fill(""));
  };

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newAliases = [...aliases];
    newAliases[index] = e.target.value;
    setAliases(newAliases);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validation.isSubmitDisabled) {
      return;
    }
    setPages(2);
    const finalAliases = aliases.map(a => a.trim());
    shuffleArray(finalAliases);
    setAliases(finalAliases);
  };

  return (
    <div className="text-white flex flex-col items-center 
        justify-center h-full font-sans">

      <form id="tournamentForm" onSubmit={handleSubmit} className="flex flex-col items-center 
        space-y-3 bg-gray-800 p-6 rounded-lg shadow-lg">

        <label htmlFor="players" className="text-lg font-semibold">
          Choose the number of players:
        </label>

        <select
          onChange={handlePlayerChange}
          value={numPlayers}
          name="players"
          id="players"
          className="bg-white text-gray-900 rounded px-3 py-1"
        >
          <option value="" disabled>Select...</option>
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="16">16</option>
        </select>

        <div id="aliasesContainer" className="flex flex-col justify-center items-center 
		space-y-2 w-full mt-3">
          {aliases.map((alias, index) => {
            const error = validation.errors[index];
            const inputClassName = [
              "bg-white rounded px-3 py-1 w-48 text-gray-900",
              "focus:outline-none focus:ring-2 focus:ring-yellow-400",
              error ? "ring-2 ring-red-500" : ""
            ].join(" ");

            return (
              <input
                key={index}
                type="text"
                placeholder={`Alias du joueur ${index + 1}`}
                className={inputClassName}
                value={alias}
                onChange={(e) => handleAliasChange(e, index)}
                title={error || ""}
                required
              />
            );
          })}
        </div>

        <button
          id="submitBtn"
          type="submit"
          className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg 
               shadow hover:bg-yellow-300 transition-all disabled:opacity-50 
               disabled:cursor-not-allowed"
          disabled={validation.isSubmitDisabled}
        >
          Submit
        </button>

      </form>
    </div>
  );
}