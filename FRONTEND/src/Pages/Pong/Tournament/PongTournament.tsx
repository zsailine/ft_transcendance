import { useState } from 'react';
import TournamentForm from './TournamentForm';
import { UserContext } from "../../../Providers/TournamentProvider"
import MatchMaking from "./MatchMaking"
import TournamentGame from './TournamentGame';
import Winner from './Winner';

export default function Tournament() {
  const [aliases, setAliases] = useState<string[]>([]);
  const [pages, setPages] = useState<number>(1);
  return (<>
    <UserContext.Provider value={{ aliases, setAliases, pages, setPages }}>
      {pages === 1 && (
        <TournamentForm />
      )}
      {pages === 2 && (
        <MatchMaking />
      )}
      {pages === 3 && (
        <TournamentGame />
      )}
      {pages === 4 && (
        <Winner />
      )}
    </UserContext.Provider>
  </>
  );
}