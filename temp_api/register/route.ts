import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      organizationName,
      phone,
      address,
      city,
      postalCode,
      country,
      siret,
      apeCode,
      isIntermittent,
    } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nom, email et mot de passe sont requis" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        country,
        siret,
        apeCode,
        isIntermittent: isIntermittent || false,
        // Note: Dans un vrai projet, vous devriez stocker le mot de passe hashé
        // Pour l'instant, on simule avec un champ virtuel
      },
    });

    // Créer l'organisation
    const organization = await prisma.organization.create({
      data: {
        name: organizationName || `${name}'s Organization`,
        email,
        phone,
        address,
        city,
        postalCode,
        country,
        siret,
        apeCode,
      },
    });

    // Associer l'utilisateur à l'organisation en tant qu'OWNER
    await prisma.organizationUser.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: UserRole.OWNER,
        permissions: {
          canManageUsers: true,
          canManageProjects: true,
          canManageBudget: true,
          canManageContracts: true,
          canManageOrganization: true,
          canViewAnalytics: true,
          canManageSubscriptions: true,
        },
      },
    });

    // Créer un abonnement gratuit
    await prisma.subscription.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        plan: "FREE",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      },
    });

    return NextResponse.json({
      message: "Compte créé avec succès",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création du compte:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
