import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Initialisation de la base de données...");

  try {
    // Vérifier si un utilisateur admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: "admin@plannitech.com",
      },
    });

    if (existingAdmin) {
      console.log("✅ Utilisateur admin déjà existant");
      return;
    }

    // Créer l'organisation par défaut
    const organization = await prisma.organization.create({
      data: {
        name: "Plannitech Demo",
        legalName: "Plannitech Demo SARL",
        description: "Organisation de démonstration Plannitech",
        email: "contact@plannitech.com",
        address: "123 Rue de la Démo",
        city: "Paris",
        postalCode: "75001",
        country: "France",
        phone: "+33123456789",
        website: "https://plannitech.com",
        siret: "12345678901234",
        apeCode: "9001Z",
        vatNumber: "FR12345678901",
      },
    });

    console.log("✅ Organisation créée:", organization.name);

    // Créer l'utilisateur admin
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@plannitech.com",
        name: "Administrateur Plannitech",
        emailVerified: new Date(),
      },
    });

    console.log("✅ Utilisateur admin créé:", adminUser.email);

    // Lier l'utilisateur admin à l'organisation
    await prisma.organizationUser.create({
      data: {
        organizationId: organization.id,
        userId: adminUser.id,
        role: UserRole.OWNER,
      },
    });

    console.log("✅ Utilisateur admin lié à l'organisation");

    // Créer quelques données de démonstration
    const demoProject = await prisma.project.create({
      data: {
        title: "Festival d'été 2024",
        description: "Projet de démonstration pour le festival d'été",
        type: "FESTIVAL",
        status: "PLANNING",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-07-31"),
        budget: 50000,
        organizationId: organization.id,
        createdById: adminUser.id,
      },
    });

    console.log("✅ Projet de démonstration créé:", demoProject.title);

    // Créer quelques contacts de démonstration
    const demoContacts = await Promise.all([
      prisma.contact.create({
        data: {
          type: "ARTIST",
          name: "Jean Dupont",
          email: "jean.dupont@example.com",
          phone: "+33123456789",
          isIntermittent: true,
          intermittentNumber: "123456789",
          organizationId: organization.id,
          createdById: adminUser.id,
        },
      }),
      prisma.contact.create({
        data: {
          type: "TECHNICIAN",
          name: "Marie Leroy",
          email: "marie.leroy@example.com",
          phone: "+33987654321",
          isIntermittent: true,
          intermittentNumber: "987654321",
          organizationId: organization.id,
          createdById: adminUser.id,
        },
      }),
    ]);

    console.log("✅ Contacts de démonstration créés:", demoContacts.length);

    console.log("\n🎉 Initialisation terminée avec succès !");
    console.log("\n📋 Informations de connexion :");
    console.log("Email: admin@plannitech.com");
    console.log("Mot de passe: admin123");
    console.log("\n⚠️  N'oubliez pas de changer le mot de passe en production !");

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
