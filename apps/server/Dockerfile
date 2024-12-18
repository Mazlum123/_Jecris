# Utilise une image Node.js officielle
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers nécessaires
# COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY package*.json ./

# Copier les fichiers sources (vérifie les chemins)
COPY . .

# Installer pnpm et les dépendances
RUN npm install -g pnpm && pnpm install

# Exposer le port
EXPOSE 4000

# Commande pour démarrer le backend
CMD ["pnpm", "dev"]
