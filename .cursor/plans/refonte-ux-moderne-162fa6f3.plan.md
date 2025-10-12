<!-- 162fa6f3-075e-4a2e-b1c9-90289c060207 20f9b1be-b4fc-44a6-8f46-f17dc3a52eba -->
# Plan Complet: Finalisation Application Plannitech

## Phase 1: Migration Base de Données (Priorité Haute)

### 1.1 Remplacer API Routes Mockées par Prisma

**Routes à migrer:**

- `app/api/shows/route.ts` - Utilise array en mémoire
- `app/api/shows/[id]/route.ts` - Utilise array en mémoire
- `app/api/venues/route.ts` - Utilise array en mémoire
- `app/api/tasks/route.ts` - Utilise array en mémoire
- `app/api/planning/route.ts` - Données mockées
- `app/api/technical-sheets/route.ts` - Données mockées
- `app/api/projects/route.ts` - Données mockées
- `app/api/budgets/route.ts` - Données mockées
- `app/api/events/route.ts` - Données mockées

**Pour chaque route:**

```typescript
// Remplacer:
let shows: Show[] = [...];

// Par:
import { prisma } from '@/lib/prisma';
const shows = await prisma.show.findMany({
  where: { organizationId: session.user.organizationId },
  include: { venue: true, artists: true }
});
```

### 1.2 Créer Routes API Manquantes

**Routes à créer:**

- `app/api/venues/[id]/route.ts` - GET, PUT, DELETE pour un lieu spécifique
- `app/api/technical-sheets/[id]/route.ts` - GET, PUT, DELETE
- `app/api/planning/[id]/route.ts` - GET, PUT, DELETE
- `app/api/team/members/route.ts` - GET, POST pour membres d'équipe
- `app/api/team/members/[id]/route.ts` - GET, PUT, DELETE
- `app/api/equipment/route.ts` - GET, POST pour équipements
- `app/api/equipment/[id]/route.ts` - GET, PUT, DELETE

## Phase 2: Formulaires Manquants (Priorité Haute)

### 2.1 Créer Formulaires de Base

**Fichiers à créer:**

1. **`components/forms/TechnicalSheetForm.tsx`**

   - Champs: title, showId, equipment[], crew[], setup, breakdown
   - Combobox pour show, equipment
   - Modal pour créer equipment

2. **`components/forms/PlanningItemForm.tsx`**

   - Champs: title, type, startTime, endTime, showId, venueId, assignedTo[]
   - Combobox pour show, venue, team members
   - Support drag & drop pour timeline

3. **`components/forms/TeamMemberForm.tsx`**

   - Champs: name, role, email, phone, availability
   - Combobox pour shows assignés
   - Modal pour créer contact

4. **`components/forms/EquipmentForm.tsx`**

   - Champs: name, category, quantity, status, supplier
   - Combobox pour supplier
   - Modal pour créer supplier

5. **`components/forms/ContactForm.tsx`**

   - Champs: name, email, phone, type, company, role
   - Validation email unique
   - Support upload photo

### 2.2 Créer Modals Manquants

**Fichiers à créer:**

1. **`components/modals/CreateEquipmentModal.tsx`**

   - Formulaire simplifié pour équipement
   - Champs essentiels uniquement

2. **`components/modals/CreateTeamMemberModal.tsx`**

   - Formulaire simplifié pour membre équipe
   - Lien avec contacts existants

3. **`components/modals/CreateTechnicalSheetModal.tsx`**

   - Formulaire simplifié pour fiche technique
   - Sélection show obligatoire

## Phase 3: Pages de Création/Édition (Priorité Haute)

### 3.1 Créer Pages Manquantes

**Pages à créer:**

1. **`app/[locale]/dashboard/shows/[id]/page.tsx`**

   - Vue détaillée d'un spectacle
   - Onglets: Info, Planning, Team, Budget, Technical

2. **`app/[locale]/dashboard/venues/[id]/edit/page.tsx`**

   - Édition d'un lieu existant
   - Utilise VenueForm

3. **`app/[locale]/dashboard/technical-sheets/new/page.tsx`**

   - Création fiche technique
   - Utilise TechnicalSheetForm

4. **`app/[locale]/dashboard/technical-sheets/[id]/edit/page.tsx`**

   - Édition fiche technique
   - Utilise TechnicalSheetForm

5. **`app/[locale]/dashboard/planning/new/page.tsx`**

   - Création élément planning
   - Utilise PlanningItemForm

6. **`app/[locale]/dashboard/team/members/new/page.tsx`**

   - Création membre équipe
   - Utilise TeamMemberForm

7. **`app/[locale]/dashboard/team/members/[id]/edit/page.tsx`**

   - Édition membre équipe
   - Utilise TeamMemberForm

8. **`app/[locale]/dashboard/resources/equipment/new/page.tsx`**

   - Création équipement
   - Utilise EquipmentForm

9. **`app/[locale]/dashboard/contacts/new/page.tsx`**

   - Création contact
   - Utilise ContactForm

10. **`app/[locale]/dashboard/contacts/[id]/edit/page.tsx`**

    - Édition contact
    - Utilise ContactForm

## Phase 4: Composants de Liste (Priorité Moyenne)

### 4.1 Améliorer Composants Liste Existants

**Fichiers à améliorer:**

1. **`components/shows/ShowsList.tsx`**

   - Ajouter pagination
   - Améliorer filtres (date range, budget range)
   - Ajouter tri par colonne
   - Ajouter actions bulk (delete multiple)

2. **`components/venues/VenuesList.tsx`**

   - Ajouter carte/map view
   - Filtres avancés (capacité, équipements)
   - Export CSV/PDF

3. **`components/technical-sheets/TechnicalSheetsList.tsx`**

   - Filtres par show, date
   - Preview modal
   - Download PDF

### 4.2 Créer Composants Liste Manquants

**Fichiers à créer:**

1. **`components/planning/PlanningList.tsx`**

   - Vue liste des éléments planning
   - Filtres par date, type, show
   - Actions: edit, delete, duplicate

2. **`components/team/TeamMembersList.tsx`**

   - Liste membres équipe
   - Filtres par rôle, disponibilité
   - Actions: edit, delete, assign to show

3. **`components/equipment/EquipmentList.tsx`**

   - Liste équipements
   - Filtres par catégorie, statut
   - Indicateur stock bas

4. **`components/contacts/ContactsList.tsx`**

   - Liste contacts
   - Filtres par type, entreprise
   - Actions: edit, delete, send email

## Phase 5: Composants Visuels (Priorité Moyenne)

### 5.1 Créer Composants Planning

**Fichiers à créer:**

1. **`components/planning/Timeline.tsx`**

   - Vue timeline Gantt
   - Drag & drop pour réorganiser
   - Zoom in/out
   - Conflits visuels

2. **`components/planning/Calendar.tsx`**

   - Vue calendrier mensuel
   - Click pour créer événement
   - Couleurs par type
   - Export iCal

3. **`components/planning/ResourceAllocation.tsx`**

   - Vue allocation ressources
   - Conflits de disponibilité
   - Suggestions optimisation

### 5.2 Créer Composants Dashboard

**Fichiers à créer:**

1. **`components/dashboard/StatsCards.tsx`**

   - Cartes statistiques
   - Shows à venir, budget, équipe
   - Graphiques mini

2. **`components/dashboard/RecentActivity.tsx`**

   - Activité récente
   - Timeline des actions
   - Filtres par type

3. **`components/dashboard/UpcomingShows.tsx`**

   - Spectacles à venir
   - Countdown
   - Status indicators

## Phase 6: Fonctionnalités Avancées (Priorité Basse)

### 6.1 Système de Notifications

**Fichiers à créer:**

1. **`app/api/notifications/route.ts`**

   - GET, POST, PUT notifications
   - Mark as read
   - Filtres par type

2. **`components/notifications/NotificationCenter.tsx`**

   - Dropdown notifications
   - Badge count
   - Mark all as read

### 6.2 Export et Rapports

**Fichiers à créer:**

1. **`app/api/exports/shows/route.ts`**

   - Export shows en PDF/CSV
   - Filtres personnalisables

2. **`app/api/exports/planning/route.ts`**

   - Export planning en PDF
   - Format imprimable

3. **`components/reports/ShowReport.tsx`**

   - Rapport détaillé spectacle
   - Budget vs actual
   - Timeline

### 6.3 Gestion Documents

**Fichiers à créer:**

1. **`app/api/documents/route.ts`**

   - Upload documents
   - Association avec shows/venues
   - Download/delete

2. **`components/documents/DocumentUpload.tsx`**

   - Drag & drop upload
   - Preview
   - Gestion versions

## Phase 7: Optimisations et Tests (Priorité Basse)

### 7.1 Performance

- Ajouter pagination côté serveur
- Implémenter cache avec React Query
- Optimiser images avec Next/Image
- Lazy loading pour composants lourds

### 7.2 Validation

- Ajouter Zod schemas pour tous les formulaires
- Validation côté serveur pour toutes les API routes
- Messages d'erreur traduits

### 7.3 Tests

- Tests unitaires pour composants critiques
- Tests d'intégration pour API routes
- Tests E2E pour flows principaux

## Ordre d'Implémentation Recommandé

1. **Phase 1.1** - Migration API Routes (2-3h)
2. **Phase 1.2** - Routes API manquantes (1-2h)
3. **Phase 2.1** - Formulaires de base (3-4h)
4. **Phase 3.1** - Pages création/édition (2-3h)
5. **Phase 4.2** - Composants liste manquants (2h)
6. **Phase 5.1** - Composants planning (3-4h)
7. **Phase 2.2** - Modals manquants (1h)
8. **Phase 4.1** - Améliorer listes existantes (2h)
9. **Phase 5.2** - Composants dashboard (2h)
10. **Phase 6** - Fonctionnalités avancées (optionnel)
11. **Phase 7** - Optimisations (optionnel)

## Estimation Totale

- **Critique (Phases 1-3):** 8-12 heures
- **Important (Phases 4-5):** 7-10 heures
- **Optionnel (Phases 6-7):** 10-15 heures

**Total minimum fonctionnel:** 15-22 heures

**Total complet:** 25-37 heures

### To-dos

- [ ] Créer le composant Combobox réutilisable avec recherche et création
- [ ] Créer les modals de création rapide (Contact, Venue, Equipment, Artist)
- [ ] Mettre à jour ShowForm avec Combobox pour venue et artists
- [ ] Mettre à jour VenueForm avec Combobox pour contact
- [ ] Ajouter support de recherche dans les API routes existantes
- [ ] Tester l'intégration complète et l'internationalisation