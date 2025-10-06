import { NextRequest, NextResponse } from "next/server";

// Stockage temporaire des utilisateurs en mémoire
// En production, utiliser une vraie base de données
let users: any[] = [
  {
    id: "1",
    email: "admin@plannitech.com",
    password: "admin123", // En production, hasher le mot de passe
    name: "Administrateur",
    role: "ADMIN",
    organizationId: "1",
    organizationName: "Mon Organisation",
    createdAt: new Date().toISOString(),
  }
];

// Fonction pour vérifier les identifiants (utilisée par l'authentification)
export function verifyCredentials(email: string, password: string) {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizations: [{
      id: user.organizationId,
      organizationId: user.organizationId,
      role: user.role,
      organization: {
        id: user.organizationId,
        name: user.organizationName,
        email: user.email,
        description: "Organisation principale",
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(),
      }
    }],
  };
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

// Fonction pour vérifier les identifiants (utilisée par l'authentification)
export function verifyCredentials(email: string, password: string) {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizations: [{
      id: user.organizationId,
      organizationId: user.organizationId,
      role: user.role,
      organization: {
        id: user.organizationId,
        name: user.organizationName,
        email: user.email,
        description: "Organisation principale",
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(),
      }
    }],
  };
}