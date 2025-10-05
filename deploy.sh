#!/bin/bash

# Script de déploiement Plannitech
echo "🚀 Déploiement de Plannitech..."

# Variables
APP_NAME="plannitech"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/votre-username/plannitech.git"  # Remplacez par votre repo
BRANCH="main"

# Mise à jour du code
echo "📥 Mise à jour du code..."
cd $APP_DIR
git pull origin $BRANCH

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --production

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Redémarrage de l'application
echo "🔄 Redémarrage de l'application..."
pm2 restart $APP_NAME

echo "✅ Déploiement terminé !"