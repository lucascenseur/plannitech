#!/bin/bash

# ==============================================================================
# SCRIPT DE DÉPLOIEMENT FINAL POUR PLANNITECH
# ==============================================================================
# Ce script déploie l'application Next.js corrigée avec le système multilingue
# et la structure simplifiée.
#
# Auteur: Assistant IA
# Date: 5 Octobre 2025
# Version: 2.0
# ==============================================================================

# --- Configuration Globale ---
APP_NAME="plannitech"
REPO_URL="https://github.com/lucascenseur/plannitech.git"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="plannitech.com"
NODE_VERSION="18"
PM2_PROCESS_NAME="plannitech-app"

# --- Couleurs pour la sortie du terminal ---
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# --- Fonctions utilitaires ---
log_info() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

log_error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "Ce script doit être exécuté en tant que root ou avec sudo."
    fi
}

# --- Étape 0: Vérification des privilèges root ---
check_root

log_info "🚀 Déploiement final de $APP_NAME avec structure corrigée..."

# --- Étape 1: Mise à jour du dépôt ---
log_info "📥 Mise à jour du dépôt Git..."
cd "$APP_DIR" || log_error "Impossible de naviguer vers $APP_DIR."

# Sauvegarder les modifications locales
git stash || log_warn "Aucune modification locale à sauvegarder."

# Mettre à jour depuis GitHub
git fetch origin main || log_error "Échec du fetch Git."
git reset --hard origin/main || log_error "Échec du reset Git."

log_info "✅ Dépôt mis à jour avec la structure corrigée."

# --- Étape 2: Installation des dépendances ---
log_info "📦 Installation des dépendances..."
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps || log_error "Échec de l'installation des dépendances."

# --- Étape 3: Build de l'application ---
log_info "🔨 Build de l'application..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build || log_error "Échec du build de l'application."

log_info "✅ Build terminé avec succès."

# --- Étape 4: Redémarrage de l'application ---
log_info "🔄 Redémarrage de l'application..."

# Arrêter l'ancien processus
pm2 stop "$PM2_PROCESS_NAME" &> /dev/null || log_warn "Aucun processus PM2 à arrêter."

# Démarrer le nouveau processus
pm2 start "$APP_DIR/ecosystem.config.js" || log_error "Échec du démarrage de l'application avec PM2."

# Sauvegarder la configuration PM2
pm2 save || log_error "Échec de la sauvegarde de la configuration PM2."

log_info "✅ Application redémarrée avec PM2."

# --- Étape 5: Test de l'application ---
log_info "🧪 Test de l'application..."
sleep 5

# Vérifier que l'application répond
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log_info "✅ Application accessible sur le port 3000."
else
    log_warn "⚠️ Application non accessible sur le port 3000. Vérifiez les logs PM2."
fi

# --- Étape 6: Redémarrage de Nginx ---
log_info "🌐 Redémarrage de Nginx..."
sudo nginx -t && sudo systemctl restart nginx || log_error "Échec du redémarrage de Nginx."

log_info "✅ Nginx redémarré."

# --- Étape 7: Test final ---
log_info "🎯 Test final de l'application..."
sleep 3

if curl -f "https://$DOMAIN" > /dev/null 2>&1; then
    log_info "🎉 Déploiement réussi ! L'application est accessible sur https://$DOMAIN"
else
    log_warn "⚠️ L'application pourrait ne pas être accessible. Vérifiez la configuration Nginx et les logs."
fi

# --- Résumé du déploiement ---
log_info "📋 Résumé du déploiement :"
log_info "   • Structure simplifiée (suppression des doublons)"
log_info "   • Système multilingue corrigé"
log_info "   • Dashboard accessible via /fr/dashboard, /en/dashboard, /es/dashboard"
log_info "   • Redirection automatique de / vers /fr/landing"
log_info "   • Routes d'authentification multilingues"

log_info "🔧 Commandes utiles :"
log_info "   • Vérifier les logs PM2 : pm2 logs $PM2_PROCESS_NAME"
log_info "   • Redémarrer l'application : pm2 restart $PM2_PROCESS_NAME"
log_info "   • Vérifier le statut : pm2 status"
log_info "   • Vérifier Nginx : sudo nginx -t"

log_info "🎉 Déploiement final terminé !"
