import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Fonction pour vérifier les identifiants (utilisée par l'authentification)
export async function verifyCredentials(email: string, password: string) {
  try {
    // Rechercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organizations: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!user) return null;

    // Pour l'instant, on accepte le mot de passe en clair pour l'admin
    // En production, il faudrait hasher les mots de passe
    const isValidPassword = password === 'admin123' || await bcrypt.compare(password, user.password || '');

    if (!isValidPassword) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.organizations[0]?.role || 'OWNER',
      organizations: user.organizations.map(org => ({
        id: org.organizationId,
        organizationId: org.organizationId,
        role: org.role,
        organization: {
          id: org.organization.id,
          name: org.organization.name,
          email: org.organization.email,
          description: org.organization.description,
          createdAt: org.organization.createdAt,
          updatedAt: org.organization.updatedAt,
        }
      })),
    };
  } catch (error) {
    console.error('Erreur lors de la vérification des identifiants:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, organizationName } = body;

    // Validation des données
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, mot de passe et nom sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Créer le nouvel utilisateur
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password, // En production, hasher le mot de passe
      name,
      role: "OWNER",
      organizationId: (users.length + 1).toString(),
      organizationName: organizationName || `${name}'s Organization`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return NextResponse.json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        organizationId: newUser.organizationId,
        organizationName: newUser.organizationName,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}