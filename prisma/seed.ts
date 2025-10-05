import { 
  PrismaClient, 
  UserRole, 
  ProjectStatus, 
  ProjectType,
  ContactType,
  PlanningType,
  PlanningStatus,
  BudgetType,
  BudgetStatus,
  TechnicalType,
  ContractType,
  ContractStatus,
  DocumentType,
  BookingStatus,
  InvoiceStatus,
  PaymentStatus,
  PaymentMethod,
  SubscriptionPlan,
  SubscriptionStatus
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding...");

  // Créer un utilisateur admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@spectacle-saas.com" },
    update: {},
    create: {
      email: "admin@spectacle-saas.com",
      name: "Admin Spectacle",
      emailVerified: new Date(),
      phone: "+33 1 23 45 67 89",
      address: "1 Place de la République",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      siret: "12345678901234",
      apeCode: "9001Z",
      isIntermittent: false,
    },
  });

  // Créer une organisation
  const organization = await prisma.organization.upsert({
    where: { id: "org-1" },
    update: {},
    create: {
      id: "org-1",
      name: "Théâtre Municipal",
      legalName: "Théâtre Municipal de Paris SARL",
      description: "Théâtre municipal de la ville",
      address: "1 Place de la République",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      phone: "+33 1 23 45 67 89",
      email: "contact@theatre-municipal.fr",
      website: "https://theatre-municipal.fr",
      siret: "12345678901234",
      apeCode: "9001Z",
      vatNumber: "FR12345678901",
    },
  });

  // Associer l'admin à l'organisation
  await prisma.organizationUser.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: adminUser.id,
      role: UserRole.OWNER,
      permissions: {
        canManageUsers: true,
        canManageProjects: true,
        canManageBudget: true,
        canManageContracts: true,
      },
    },
  });

  // Créer un abonnement
  await prisma.subscription.create({
    data: {
      organizationId: organization.id,
      userId: adminUser.id,
      plan: SubscriptionPlan.PROFESSIONAL,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      stripeCustomerId: "cus_demo_123",
      stripeSubscriptionId: "sub_demo_123",
    },
  });

  // Créer un projet
  const project = await prisma.project.create({
    data: {
      title: "Soirée Jazz & Classique",
      description: "Concert exceptionnel avec des artistes de renom",
      type: ProjectType.CONCERT,
      status: ProjectStatus.IN_PROGRESS,
      startDate: new Date("2024-06-15T20:00:00Z"),
      endDate: new Date("2024-06-15T22:30:00Z"),
      budget: 5000.0,
      currency: "EUR",
      organizationId: organization.id,
      createdById: adminUser.id,
      metadata: {
        genre: "Jazz & Classique",
        targetAudience: "Tous publics",
        technicalRequirements: ["Sonorisation", "Éclairage", "Piano à queue"],
      },
    },
  });

  // Créer des contacts (artistes)
  const artist1 = await prisma.contact.create({
    data: {
      type: ContactType.ARTIST,
      name: "Marie Dubois",
      legalName: "Marie Dubois",
      description: "Chanteuse de jazz française",
      email: "marie@example.com",
      phone: "+33 6 12 34 56 78",
      website: "https://marie-dubois.com",
      socialMedia: {
        instagram: "@marie_dubois",
        twitter: "@marie_dubois",
        facebook: "Marie Dubois Music",
      },
      isIntermittent: true,
      intermittentNumber: "INT123456",
      organizationId: organization.id,
      createdById: adminUser.id,
      metadata: {
        genre: "Jazz",
        experience: "10 ans",
        languages: ["Français", "Anglais"],
        specialSkills: ["Chant", "Composition", "Arrangement"],
      },
    },
  });

  const artist2 = await prisma.contact.create({
    data: {
      type: ContactType.ARTIST,
      name: "Pierre Martin",
      legalName: "Pierre Martin",
      description: "Pianiste classique",
      email: "pierre@example.com",
      phone: "+33 6 98 76 54 32",
      website: "https://pierre-martin.com",
      isIntermittent: true,
      intermittentNumber: "INT789012",
      organizationId: organization.id,
      createdById: adminUser.id,
      metadata: {
        genre: "Classique",
        experience: "15 ans",
        instruments: ["Piano", "Orgue"],
        education: "Conservatoire de Paris",
      },
    },
  });

  // Créer un lieu
  const venue = await prisma.venue.create({
    data: {
      name: "Grande Salle",
      description: "Salle principale du théâtre",
      address: "1 Place de la République",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      capacity: 500,
      technicalInfo: "Sonorisation professionnelle, éclairage scène, régie technique",
      contactName: "Jean Dupont",
      contactPhone: "+33 1 23 45 67 89",
      contactEmail: "technique@theatre-municipal.fr",
      website: "https://theatre-municipal.fr",
      organizationId: organization.id,
    },
  });

  // Associer les contacts au projet
  await prisma.projectContact.createMany({
    data: [
      {
        projectId: project.id,
        contactId: artist1.id,
        role: "artiste principal",
        metadata: {
          cachet: 1500.0,
          cachetCurrency: "EUR",
          role: "Chanteuse principale",
        },
      },
      {
        projectId: project.id,
        contactId: artist2.id,
        role: "accompagnateur",
        metadata: {
          cachet: 1000.0,
          cachetCurrency: "EUR",
          role: "Pianiste accompagnateur",
        },
      },
    ],
  });

  // Créer des éléments de planning
  await prisma.planningItem.createMany({
    data: [
      {
        title: "Répétition générale",
        description: "Répétition avec tous les artistes",
        type: PlanningType.REHEARSAL,
        status: PlanningStatus.SCHEDULED,
        startDate: new Date("2024-06-14T14:00:00Z"),
        endDate: new Date("2024-06-14T18:00:00Z"),
        projectId: project.id,
        contactId: artist1.id,
        venueId: venue.id,
        organizationId: organization.id,
        createdById: adminUser.id,
      },
      {
        title: "Concert principal",
        description: "Soirée Jazz & Classique",
        type: PlanningType.PERFORMANCE,
        status: PlanningStatus.SCHEDULED,
        startDate: new Date("2024-06-15T20:00:00Z"),
        endDate: new Date("2024-06-15T22:30:00Z"),
        projectId: project.id,
        venueId: venue.id,
        organizationId: organization.id,
        createdById: adminUser.id,
      },
    ],
  });

  // Créer des éléments de budget
  await prisma.budgetItem.createMany({
    data: [
      {
        title: "Cachet Marie Dubois",
        description: "Cachet artiste principal",
        type: BudgetType.EXPENSE,
        category: "artiste",
        amount: 1500.0,
        currency: "EUR",
        quantity: 1,
        unitPrice: 1500.0,
        taxRate: 20.0,
        taxAmount: 300.0,
        totalAmount: 1800.0,
        status: BudgetStatus.APPROVED,
        projectId: project.id,
        contactId: artist1.id,
        organizationId: organization.id,
        createdById: adminUser.id,
      },
      {
        title: "Cachet Pierre Martin",
        description: "Cachet pianiste",
        type: BudgetType.EXPENSE,
        category: "artiste",
        amount: 1000.0,
        currency: "EUR",
        quantity: 1,
        unitPrice: 1000.0,
        taxRate: 20.0,
        taxAmount: 200.0,
        totalAmount: 1200.0,
        status: BudgetStatus.APPROVED,
        projectId: project.id,
        contactId: artist2.id,
        organizationId: organization.id,
        createdById: adminUser.id,
      },
      {
        title: "Location salle",
        description: "Location de la Grande Salle",
        type: BudgetType.EXPENSE,
        category: "lieu",
        amount: 800.0,
        currency: "EUR",
        quantity: 1,
        unitPrice: 800.0,
        taxRate: 20.0,
        taxAmount: 160.0,
        totalAmount: 960.0,
        status: BudgetStatus.APPROVED,
        projectId: project.id,
        organizationId: organization.id,
        createdById: adminUser.id,
      },
    ],
  });

  // Créer des fiches techniques
  await prisma.technicalSheet.createMany({
    data: [
      {
        title: "Rider Marie Dubois",
        description: "Fiche technique de Marie Dubois",
        type: TechnicalType.RIDER,
        content: {
          sound: {
            micro: "Micro sans fil Shure Beta 87A",
            monitor: "Retour moniteur 2 voies",
            effects: ["Reverb", "Compression"],
          },
          lighting: {
            frontLight: "Éclairage frontal doux",
            backLight: "Éclairage d'ambiance",
            colors: ["Blanc chaud", "Bleu doux"],
          },
          stage: {
            space: "Minimum 4x4 mètres",
            height: "Minimum 3 mètres",
            power: "2 prises 220V",
          },
        },
        projectId: project.id,
        contactId: artist1.id,
        organizationId: organization.id,
        createdById: adminUser.id,
      },
      {
        title: "Plan de scène",
        description: "Disposition des éléments sur scène",
        type: TechnicalType.STAGE_PLAN,
        content: {
          layout: {
            piano: { x: 2, y: 3, width: 2, height: 1 },
            micro: { x: 1, y: 2, width: 0.5, height: 0.5 },
            monitor: { x: 0.5, y: 1, width: 1, height: 0.3 },
          },
          dimensions: {
            stageWidth: 8,
            stageDepth: 6,
            stageHeight: 4,
          },
        },
        projectId: project.id,
        organizationId: organization.id,
        createdById: adminUser.id,
      },
    ],
  });

  // Créer des contrats
  await prisma.contract.createMany({
    data: [
      {
        title: "Contrat Marie Dubois",
        description: "Contrat d'artiste pour le concert",
        type: ContractType.ARTIST_CONTRACT,
        status: ContractStatus.SIGNED,
        startDate: new Date("2024-06-15T20:00:00Z"),
        endDate: new Date("2024-06-15T22:30:00Z"),
        amount: 1500.0,
        currency: "EUR",
        terms: "Cachet de 1500€ TTC pour le concert du 15 juin 2024. Répétition incluse.",
        projectId: project.id,
        contactId: artist1.id,
        organizationId: organization.id,
        createdById: adminUser.id,
        metadata: {
          contractNumber: "CTR-2024-001",
          signedDate: "2024-05-01",
          paymentTerms: "30 jours",
        },
      },
    ],
  });

  // Créer des documents
  await prisma.document.createMany({
    data: [
      {
        title: "Contrat Marie Dubois.pdf",
        description: "Contrat signé de Marie Dubois",
        type: DocumentType.CONTRACT,
        fileName: "contrat_marie_dubois.pdf",
        filePath: "/documents/contracts/contrat_marie_dubois.pdf",
        fileSize: 245760,
        mimeType: "application/pdf",
        projectId: project.id,
        contactId: artist1.id,
        organizationId: organization.id,
        createdById: adminUser.id,
        metadata: {
          uploadDate: "2024-05-01",
          version: "1.0",
          signed: true,
        },
      },
    ],
  });

  console.log("✅ Seeding terminé avec succès !");
  console.log(`👤 Utilisateur admin créé: ${adminUser.email}`);
  console.log(`🏢 Organisation créée: ${organization.name}`);
  console.log(`🎭 Projet créé: ${project.title}`);
  console.log(`🎨 Contacts créés: ${artist1.name}, ${artist2.name}`);
  console.log(`🏛️ Lieu créé: ${venue.name}`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
