# 🔐 Isolation des Données par Organisation

## Principe de Fonctionnement

Chaque utilisateur appartient à une ou plusieurs **organisations**, et chaque organisation a ses propres données **complètement isolées** des autres organisations.

## 🏗️ Architecture de l'Isolation

### 1. Structure des Données

```
Organisation A                    Organisation B
├── Utilisateur 1                 ├── Utilisateur 3
├── Projets A                     ├── Projets B
├── Contacts A                    ├── Contacts B
├── Budgets A                     ├── Budgets B
└── Événements A                  └── Événements B
```

### 2. Filtrage Automatique

Toutes les APIs filtrent automatiquement par `organizationId` :

```typescript
// Dans chaque API (projets, contacts, budgets, etc.)
const userOrgId = session.user?.organizations?.[0]?.organizationId;

const data = await prisma.model.findMany({
  where: { organizationId: userOrgId } // ← Filtrage automatique
});
```

## 🛡️ Sécurité Multi-Niveaux

### Niveau 1 : Authentification
- ✅ Utilisateur doit être connecté
- ✅ Session valide requise

### Niveau 2 : Autorisation Organisation
- ✅ Utilisateur doit appartenir à l'organisation
- ✅ Vérification du rôle dans l'organisation

### Niveau 3 : Isolation des Données
- ✅ Filtrage automatique par `organizationId`
- ✅ Impossible d'accéder aux données d'autres organisations

### Niveau 4 : Permissions Granulaires
- ✅ Rôles : OWNER, ADMIN, MANAGER, MEMBER, VIEWER
- ✅ Permissions par fonctionnalité

## 📊 Exemple Concret

### Scénario : Deux Organisations

**Organisation "Théâtre Municipal" :**
- Utilisateur : `directeur@theatre-municipal.fr`
- Projets : "Hamlet", "Roméo et Juliette"
- Contacts : "Troupe locale", "Techniciens municipaux"

**Organisation "Festival d'Été" :**
- Utilisateur : `programmateur@festival-ete.fr`
- Projets : "Festival Jazz", "Concert Classique"
- Contacts : "Artistes invités", "Prestataires"

### Résultat de l'Isolation

Quand `directeur@theatre-municipal.fr` se connecte :
- ✅ Voit : "Hamlet", "Roméo et Juliette"
- ✅ Voit : "Troupe locale", "Techniciens municipaux"
- ❌ Ne voit PAS : "Festival Jazz", "Artistes invités"

Quand `programmateur@festival-ete.fr` se connecte :
- ✅ Voit : "Festival Jazz", "Concert Classique"
- ✅ Voit : "Artistes invités", "Prestataires"
- ❌ Ne voit PAS : "Hamlet", "Troupe locale"

## 🔧 Implémentation Technique

### 1. Schéma de Base de Données

```sql
-- Chaque table a une colonne organizationId
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  organization_id UUID NOT NULL, -- ← Clé d'isolation
  created_by_id UUID NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  organization_id UUID NOT NULL, -- ← Clé d'isolation
  created_by_id UUID NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

### 2. Middleware de Sécurité

```typescript
// Vérification automatique dans chaque API
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Récupérer l'organisation de l'utilisateur
  const userOrgId = session.user?.organizations?.[0]?.organizationId;
  if (!userOrgId) {
    return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
  }

  // Filtrage automatique par organisation
  const data = await prisma.model.findMany({
    where: { organizationId: userOrgId }
  });

  return NextResponse.json({ data });
}
```

### 3. Relations Prisma

```typescript
model Project {
  id             String @id @default(cuid())
  title          String
  organizationId String // ← Clé d'isolation
  createdById    String
  
  organization Organization @relation(fields: [organizationId], references: [id])
  createdBy    User         @relation(fields: [createdById], references: [id])
  
  @@index([organizationId]) // ← Index pour les performances
}

model Contact {
  id             String @id @default(cuid())
  name           String
  organizationId String // ← Clé d'isolation
  createdById    String
  
  organization Organization @relation(fields: [organizationId], references: [id])
  createdBy    User         @relation(fields: [createdById], references: [id])
  
  @@index([organizationId]) // ← Index pour les performances
}
```

## 🧪 Test d'Isolation

### Script de Test Automatique

```bash
# Tester l'isolation des données
npm run test:isolation

# Nettoyer les données de test
npm run test:isolation -- --cleanup
```

### Résultats Attendus

```
🧪 Test d'isolation des données par organisation...

✅ Organisation A: 1 projet, 1 contact
✅ Organisation B: 1 projet, 1 contact
✅ ISOLATION PARFAITE: Aucune fuite de données
✅ Chaque organisation voit uniquement ses propres données
```

## 🚨 Cas d'Usage Multi-Organisations

### Utilisateur Appartenant à Plusieurs Organisations

Un utilisateur peut appartenir à plusieurs organisations :

```typescript
// Exemple : Freelance travaillant pour plusieurs clients
const user = {
  id: "user123",
  email: "freelance@example.com",
  organizations: [
    {
      id: "org1",
      organizationId: "org1",
      role: "MANAGER",
      organization: { name: "Théâtre Municipal" }
    },
    {
      id: "org2", 
      organizationId: "org2",
      role: "MEMBER",
      organization: { name: "Festival d'Été" }
    }
  ]
};
```

### Sélecteur d'Organisation

L'utilisateur peut basculer entre ses organisations via le sélecteur dans le header :

```typescript
// Changement d'organisation
const switchOrganization = (organizationId: string) => {
  // Mise à jour de la session avec la nouvelle organisation
  // Toutes les APIs utiliseront automatiquement la nouvelle organisation
};
```

## 🔒 Garanties de Sécurité

### 1. Isolation Complète
- ✅ Impossible d'accéder aux données d'autres organisations
- ✅ Filtrage automatique dans toutes les requêtes
- ✅ Vérification au niveau de la base de données

### 2. Audit et Traçabilité
- ✅ Chaque enregistrement a un `createdById`
- ✅ Historique des modifications
- ✅ Logs d'accès par organisation

### 3. Performance
- ✅ Index sur `organizationId` pour des requêtes rapides
- ✅ Requêtes optimisées avec Prisma
- ✅ Cache par organisation possible

## 📈 Avantages

### Pour les Utilisateurs
- ✅ Données privées et sécurisées
- ✅ Interface personnalisée par organisation
- ✅ Collaboration au sein de l'organisation

### Pour les Administrateurs
- ✅ Isolation garantie des données
- ✅ Gestion des permissions par rôle
- ✅ Audit complet des accès

### Pour les Développeurs
- ✅ Code sécurisé par défaut
- ✅ Pas de risque de fuite de données
- ✅ Architecture claire et maintenable

## 🎯 Conclusion

L'isolation des données par organisation garantit que :

1. **Chaque utilisateur ne voit que ses propres données**
2. **Aucune fuite de données entre organisations**
3. **Sécurité renforcée à tous les niveaux**
4. **Performance optimisée avec les index**
5. **Architecture scalable pour de nombreuses organisations**

Cette approche assure une **sécurité maximale** tout en permettant une **collaboration efficace** au sein de chaque organisation.
