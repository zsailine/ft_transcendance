CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER, -- Peut être NULL si le joueur joue contre l'ordinateur
    winner_id INTEGER,  -- ID du gagnant (ou NULL si match nul)
    score_p1 INTEGER DEFAULT 0,
    score_p2 INTEGER DEFAULT 0,
    duration INTEGER, -- Durée du match en secondes (optionnel)
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Ici, on crée les liens avec la table users
    FOREIGN KEY (player1_id) REFERENCES users(id),
    FOREIGN KEY (player2_id) REFERENCES users(id),
    FOREIGN KEY (winner_id) REFERENCES users(id)
);