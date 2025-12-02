export class TournamentMatch {
    constructor(matchId, round, player1 = null, player2 = null, winner = null) {
        this.matchId = matchId;
        this.round = round;    
        this.player1 = player1;
        this.player2 = player2;
        this.winner = winner;
    }
}

export class Tournament {
    constructor(id, name, size, players = [], matches = [], status = 'waiting') {
        this.id = id;
		this.name = name;
		this.size = size;
        this.players = players;
        this.matches = matches;
        this.status = status;  
    }

    addPlayer(playerId) {
        if (this.players.length >= this.size) {
            return false;
        }
        this.players.push(playerId);
        return true;
    }

    addMatch(match) {
        this.matches.push(match);
    }

    setStatus(newStatus) {
        this.status = newStatus;
    }
}
