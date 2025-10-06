import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, organizationName } = await request.json();

    // Validation des données
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, mot de passe et nom sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur et l'organisation en une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          email,
          name,
          // Note: On ne stocke pas le mot de passe dans le modèle User
          // car NextAuth gère cela via les sessions
        },
      });

      // Créer l'organisation
      const organization = await tx.organization.create({
        data: {
          name: organizationName || `${name}'s Organization`,
          email: email,
          description: "Organisation créée lors de l'inscription",
        },
      });

      // Lier l'utilisateur à l'organisation en tant que propriétaire
      await tx.organizationUser.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: UserRole.OWNER,
        },
      });

      return { user, organization };
    });

    return NextResponse.json({
      message: "Utilisateur créé avec succès",
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
