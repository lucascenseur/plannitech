#!/bin/bash

# Script pour améliorer le mode test avec plus de données
# Usage: ./enhance-test-mode.sh

set -e

echo "🔧 Amélioration du mode test"
echo "============================"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 1. Créer plus de données de test pour les projets
log_info "Ajout de plus de données de test pour les projets..."

# Ajouter des projets supplémentaires dans app/(dashboard)/projects/page.tsx
cat >> temp_projects.txt << 'EOF'
        {
          id: "4",
          name: "Théâtre de Rue",
          description: "Spectacle de théâtre en plein air dans le centre-ville",
          type: "SHOW",
          status: "DEVELOPMENT",
          startDate: new Date("2024-04-15"),
          endDate: new Date("2024-04-15"),
          venue: "Place du Marché",
          budget: 8000,
          teamSize: 6,
          isPublic: true,
          tags: ["théâtre", "rue", "gratuit"],
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationId: "1"
        },
        {
          id: "5",
          name: "Concert Classique",
          description: "Orchestre symphonique avec soliste international",
          type: "CONCERT",
          status: "PRODUCTION",
          startDate: new Date("2024-05-20"),
          endDate: new Date("2024-05-20"),
          venue: "Opéra National",
          budget: 75000,
          teamSize: 45,
          isPublic: true,
          tags: ["classique", "orchestre", "prestige"],
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationId: "1"
        },
        {
          id: "6",
          name: "Festival de Danse",
          description: "Festival international de danse contemporaine",
          type: "FESTIVAL",
          status: "TOURING",
          startDate: new Date("2024-06-10"),
          endDate: new Date("2024-06-16"),
          venue: "Centre Culturel International",
          budget: 120000,
          teamSize: 35,
          isPublic: true,
          tags: ["danse", "contemporain", "international"],
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationId: "1"
        }
EOF

# 2. Créer plus de données de test pour les contacts
log_info "Ajout de plus de données de test pour les contacts..."

cat >> temp_contacts.txt << 'EOF'
        {
          id: "4",
          firstName: "Pierre",
          lastName: "Durand",
          email: "pierre.durand@music.com",
          phone: "+33111222333",
          type: "ARTIST",
          company: "Ensemble Musical",
          position: "Chef d'orchestre",
          isIntermittent: true,
          intermittentNumber: "987654321",
          skills: ["direction", "musique classique", "orchestration"],
          rates: { hourly: 80, daily: 600 },
          availability: [
            {
              startDate: new Date("2024-01-01"),
              endDate: new Date("2024-12-31"),
              status: "AVAILABLE",
              reason: ""
            }
          ],
          tags: ["classique", "direction", "prestige"],
          notes: "Chef d'orchestre renommé avec 20 ans d'expérience",
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationId: "1"
        },
        {
          id: "5",
          firstName: "Sarah",
          lastName: "Moreau",
          email: "sarah.moreau@dance.com",
          phone: "+33444555666",
          type: "ARTIST",
          company: "Compagnie de Danse Moderne",
          position: "Danseuse principale",
          isIntermittent: true,
          intermittentNumber: "456789123",
          skills: ["danse contemporaine", "chorégraphie", "improvisation"],
          rates: { hourly: 45, daily: 350 },
          availability: [
            {
              startDate: new Date("2024-01-01"),
              endDate: new Date("2024-12-31"),
              status: "AVAILABLE",
              reason: ""
            }
          ],
          tags: ["danse", "contemporain", "création"],
          notes: "Danseuse étoile avec une technique exceptionnelle",
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationId: "1"
        },
        {
          id: "6",
          firstName: "Marc",
          lastName: "Leroy",
          email: "marc.leroy@venue.com",
          phone: "+33777888999",
          type: "VENUE",
          company: "Opéra National",
          position: "Directeur technique",
          isIntermittent: false,
          skills: ["gestion technique", "son", "éclairage", "sécurité"],
          rates: { hourly: 0, daily: 0 },
          availability: [
            {
              startDate: new Date("2024-01-01"),
              endDate: new Date("2024-12-31"),
              status: "AVAILABLE",
              reason: ""
            }
          ],
          tags: ["lieu", "prestige", "technique"],
          notes: "Directeur technique de l'Opéra avec 15 ans d'expérience",
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationId: "1"
        }
EOF

# 3. Créer des données de test pour le planning
log_info "Création de données de test pour le planning..."

cat > temp_planning.txt << 'EOF'
// Données de test pour le planning
const mockPlanningItems = [
  {
    id: "1",
    title: "Répétition générale",
    description: "Répétition complète du spectacle",
    type: "REHEARSAL",
    startDate: new Date("2024-02-10T14:00:00"),
    endDate: new Date("2024-02-10T18:00:00"),
    location: "Théâtre Municipal",
    participants: ["Marie Dubois", "Jean Martin"],
    projectId: "1",
    status: "CONFIRMED"
  },
  {
    id: "2",
    title: "Montage technique",
    description: "Installation du matériel son et lumière",
    type: "SETUP",
    startDate: new Date("2024-02-14T09:00:00"),
    endDate: new Date("2024-02-14T17:00:00"),
    location: "Théâtre Municipal",
    participants: ["Jean Martin"],
    projectId: "1",
    status: "PENDING"
  },
  {
    id: "3",
    title: "Première représentation",
    description: "Première du spectacle",
    type: "PERFORMANCE",
    startDate: new Date("2024-02-15T20:00:00"),
    endDate: new Date("2024-02-15T22:00:00"),
    location: "Théâtre Municipal",
    participants: ["Marie Dubois", "Jean Martin", "Sophie Leroy"],
    projectId: "1",
    status: "CONFIRMED"
  }
];
EOF

# 4. Créer des données de test pour le budget
log_info "Création de données de test pour le budget..."

cat > temp_budget.txt << 'EOF'
// Données de test pour le budget
const mockBudgetItems = [
  {
    id: "1",
    projectId: "1",
    category: "ARTISTIC",
    description: "Cachets artistes",
    amount: 5000,
    actualAmount: 4800,
    status: "PAID",
    dueDate: new Date("2024-02-20"),
    vendor: "Marie Dubois"
  },
  {
    id: "2",
    projectId: "1",
    category: "TECHNICAL",
    description: "Location matériel son",
    amount: 1500,
    actualAmount: 1500,
    status: "PENDING",
    dueDate: new Date("2024-02-25"),
    vendor: "Tech Events"
  },
  {
    id: "3",
    projectId: "1",
    category: "VENUE",
    description: "Location salle",
    amount: 2000,
    actualAmount: 0,
    status: "PENDING",
    dueDate: new Date("2024-02-28"),
    vendor: "Théâtre Municipal"
  }
];
EOF

# 5. Créer un script de simulation des fonctionnalités
log_info "Création d'un script de simulation..."

cat > simulate-features.js << 'EOF'
// Script de simulation des fonctionnalités
// Ce fichier peut être importé dans les composants pour simuler les API calls

export const simulateApiCall = async (endpoint, data, delay = 1000) => {
  console.log(`🔄 Simulation API: ${endpoint}`, data);
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simuler une réponse réussie
  return {
    success: true,
    data: data,
    message: "Opération simulée avec succès"
  };
};

export const simulateError = async (message = "Erreur simulée") => {
  console.log(`❌ Simulation erreur: ${message}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  throw new Error(message);
};

// Données de test étendues
export const mockData = {
  projects: [
    // Projets existants + nouveaux
  ],
  contacts: [
    // Contacts existants + nouveaux
  ],
  planning: [
    // Événements de planning
  ],
  budget: [
    // Éléments de budget
  ]
};
EOF

log_success "Amélioration du mode test terminée !"
echo ""
echo "📋 Fichiers créés :"
echo "- temp_projects.txt : Projets supplémentaires"
echo "- temp_contacts.txt : Contacts supplémentaires" 
echo "- temp_planning.txt : Données de planning"
echo "- temp_budget.txt : Données de budget"
echo "- simulate-features.js : Script de simulation"
echo ""
echo "🔧 Pour appliquer ces améliorations :"
echo "1. Copiez le contenu des fichiers temp_* dans vos composants"
echo "2. Importez simulate-features.js dans vos pages"
echo "3. Remplacez les appels API par simulateApiCall()"
echo ""
echo "💡 Cela donnera une expérience plus riche en mode test !"

