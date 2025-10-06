import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initialisation de la base de données...');

  try {
    // Vérifier si un utilisateur admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@plannitech.com' }
    });

    if (existingAdmin) {
      console.log('✅ Utilisateur admin déjà existant');
      return;
    }

    // Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@plannitech.com',
        name: 'Administrateur',
        isIntermittent: false,
      }
    });

    console.log('✅ Utilisateur admin créé:', adminUser.email);

    // Créer l'organisation par défaut
    const defaultOrg = await prisma.organization.create({
      data: {
        name: 'Mon Organisation',
        description: 'Organisation par défaut',
        email: 'admin@plannitech.com',
        users: {
          create: {
            userId: adminUser.id,
            role: 'OWNER',
            permissions: {
              canManageProjects: true,
              canManageContacts: true,
              canManageBudget: true,
              canManageTechnical: true,
              canManagePlanning: true,
              canManageUsers: true,
              canManageBilling: true,
              canViewReports: true,
            }
          }
        }
      }
    });

    console.log('✅ Organisation par défaut créée:', defaultOrg.name);

    // Créer un abonnement gratuit
    await prisma.subscription.create({
      data: {
        organizationId: defaultOrg.id,
        userId: adminUser.id,
        plan: 'FREE',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
      }
    });

    console.log('✅ Abonnement gratuit créé');

    // Créer quelques données de démonstration
    const demoProject = await prisma.project.create({
      data: {
        title: 'Concert de démonstration',
        description: 'Un projet de démonstration pour tester l\'application',
        type: 'CONCERT',
        status: 'PLANNING',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Dans 30 jours
        endDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000), // Dans 31 jours
        budget: 5000.00,
        organizationId: defaultOrg.id,
        createdById: adminUser.id,
      }
    });

    console.log('✅ Projet de démonstration créé:', demoProject.title);

    const demoContact = await prisma.contact.create({
      data: {
        name: 'Artiste Démo',
        email: 'artiste@demo.com',
        phone: '+33 1 23 45 67 89',
        type: 'ARTIST',
        description: 'Un contact de démonstration',
        organizationId: defaultOrg.id,
        createdById: adminUser.id,
      }
    });

    console.log('✅ Contact de démonstration créé:', demoContact.name);

    // Lier le contact au projet
    await prisma.projectContact.create({
      data: {
        projectId: demoProject.id,
        contactId: demoContact.id,
        role: 'artiste principal',
      }
    });

    console.log('✅ Liaison projet-contact créée');

    // Créer un élément de budget
    await prisma.budgetItem.create({
      data: {
        title: 'Cachet artiste',
        description: 'Cachet pour l\'artiste principal',
        type: 'EXPENSE',
        category: 'artiste',
        amount: 2000.00,
        quantity: 1,
        unitPrice: 2000.00,
        taxRate: 20.0,
        taxAmount: 400.00,
        totalAmount: 2400.00,
        status: 'PLANNED',
        projectId: demoProject.id,
        contactId: demoContact.id,
        organizationId: defaultOrg.id,
        createdById: adminUser.id,
      }
    });

    console.log('✅ Élément de budget créé');

    // Créer un événement de planning
    await prisma.planningItem.create({
      data: {
        title: 'Répétition générale',
        description: 'Répétition avant le concert',
        type: 'REHEARSAL',
        startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // Dans 25 jours
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 heures plus tard
        status: 'SCHEDULED',
        projectId: demoProject.id,
        contactId: demoContact.id,
        organizationId: defaultOrg.id,
        createdById: adminUser.id,
      }
    });

    console.log('✅ Événement de planning créé');

    console.log('🎉 Initialisation terminée avec succès !');
    console.log('');
    console.log('📋 Informations de connexion :');
    console.log('Email: admin@plannitech.com');
    console.log('Mot de passe: admin123');
    console.log('');
    console.log('🔗 URL de connexion: /fr/auth/signin');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
