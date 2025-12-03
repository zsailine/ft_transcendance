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
    constructor(id, name, maxPlayers, matches = [], status = 'waiting') {
        
        this.id = id;
		this.name = name;
		this.maxPlayers = maxPlayers;
        this.players = new Map();
        this.currentPlayers = this.players.size;
        this.matches = matches;
        this.status = status; 
    }

    addPlayer(username, socket) {
        if (this.players.size >= this.maxPlayers) {
            return false;
        }
        this.players.set(username, socket);
        this.currentPlayers = this.players.size;
        if (this.players.size === this.maxPlayers)
            this.status = "Full"
        return true;
    }

    removeplayer (username)
    {
        this.players.has((username) => {
            this.players.delete(socket.username);
        })
    }

    addMatch(match) {
        this.matches.push(match);
    }

    setStatus(newStatus) {
        this.status = newStatus;
    }
}
