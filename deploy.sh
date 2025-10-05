#!/bin/bash

# Script de déploiement Plannitech
echo "🚀 Déploiement de Plannitech..."

# Variables
APP_NAME="plannitech"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/lucascenseur/plannitech.git"
BRANCH="main"

# Mise à jour du code
echo "📥 Mise à jour du code..."
cd $APP_DIR
git pull origin $BRANCH

# Installation des dépendances (optimisé pour Next.js 14.2.33)
echo "📦 Installation des dépendances..."
npm cache clean --force
npm ci --production --no-optional

# Build de l'application (optimisé pour Next.js 14.2.33)
echo "🔨 Build de l'application..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Redémarrage de l'application
echo "🔄 Redémarrage de l'application..."
pm2 restart $APP_NAME

echo "✅ Déploiement terminé !"