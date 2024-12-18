-- Table Utilisateur
CREATE TABLE Utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('simple', 'premium')) DEFAULT 'simple',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Ecrit (Livres)
CREATE TABLE Ecrit (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INT REFERENCES Utilisateur(id) ON DELETE CASCADE,
    statut VARCHAR(50) CHECK (statut IN ('brouillon', 'public')) DEFAULT 'brouillon'
);

-- Table Publication (Livres publiés)
CREATE TABLE Publication (
    id SERIAL PRIMARY KEY,
    format VARCHAR(50) CHECK (format IN ('numerique', 'papier')) NOT NULL,
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prix DECIMAL(10,2) NOT NULL,
    id_ecrit INT REFERENCES Ecrit(id) ON DELETE CASCADE
);

-- Table Panier
CREATE TABLE Panier (
    id SERIAL PRIMARY KEY,
    id_utilisateur INT REFERENCES Utilisateur(id) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Panier_Publication (Relation Panier - Publication)
CREATE TABLE Panier_Publication (
    id_panier INT REFERENCES Panier(id) ON DELETE CASCADE,
    id_publication INT REFERENCES Publication(id) ON DELETE CASCADE,
    PRIMARY KEY (id_panier, id_publication)
);

-- Table Vente (Transactions)
CREATE TABLE Vente (
    id SERIAL PRIMARY KEY,
    date_vente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantite INT CHECK (quantite > 0) NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    id_publication INT REFERENCES Publication(id) ON DELETE CASCADE,
    id_utilisateur INT REFERENCES Utilisateur(id) ON DELETE CASCADE
);

-- Optionnel : Ajouter des utilisateurs et livres de test
INSERT INTO Utilisateur (nom, email, mot_de_passe, type) 
VALUES ('John Doe', 'john@example.com', 'hashed_password', 'simple');

INSERT INTO Ecrit (titre, contenu, id_utilisateur, statut) 
VALUES ('Livre Test', 'Ceci est un contenu de test', 1, 'public');

INSERT INTO Publication (format, prix, id_ecrit) 
VALUES ('numerique', 19.99, 1);
