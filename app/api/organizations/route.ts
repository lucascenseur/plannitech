import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Stockage temporaire en mémoire
let organizations: any[] = [];
let organizationMembers: any[] = [];

// Initialiser avec une organisation par défaut
if (organizations.length === 0) {
  const defaultOrg = {
    id: "1",
    name: "Mon Organisation",
    slug: "mon-organisation",
    description: "Organisation par défaut",
    type: "COMPANY",
    status: "ACTIVE",
    website: "",
    logo: "",
    address: {},
    contact: {},
    settings: {
      timezone: "Europe/Paris",
      currency: "EUR",
      language: "fr",
      dateFormat: "DD/MM/YYYY",
    },
    billing: {
      plan: "FREE",
      status: "ACTIVE",
      billingCycle: "MONTHLY",
      maxUsers: 1,
      maxProjects: 5,
      maxStorage: 1000,
    },
    features: {
      advancedReporting: false,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabel: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdById: "admin",
  };
  organizations.push(defaultOrg);

  // Ajouter l'admin comme membre
  const adminMember = {
    id: "1",
    userId: "admin",
    organizationId: "1",
    role: "OWNER",
    status: "ACTIVE",
    permissions: {
      canManageProjects: true,
      canManageContacts: true,
      canManageBudget: true,
      canManageTechnical: true,
      canManagePlanning: true,
      canManageUsers: true,
      canManageBilling: true,
      canViewReports: true,
    },
    joinedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  organizationMembers.push(adminMember);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Récupérer les organisations de l'utilisateur
    const userMemberships = organizationMembers.filter(
      member => member.userId === session.user?.id && member.status === 'ACTIVE'
    );

    const userOrganizations = organizations.filter(org =>
      userMemberships.some(member => member.organizationId === org.id)
    );

    // Enrichir avec les informations de membre
    const organizationsWithRole = userOrganizations.map(org => {
      const membership = userMemberships.find(member => member.organizationId === org.id);
      return {
        ...org,
        role: membership?.role,
        permissions: membership?.permissions,
        memberCount: organizationMembers.filter(m => m.organizationId === org.id && m.status === 'ACTIVE').length,
      };
    });

    return NextResponse.json({ organizations: organizationsWithRole });
  } catch (error) {
    console.error('Erreur lors de la récupération des organisations:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const newOrganization = {
      id: (organizations.length + 1).toString(),
      name: body.name,
      slug: body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: body.description || '',
      type: body.type || 'COMPANY',
      status: 'ACTIVE',
      website: body.website || '',
      logo: body.logo || '',
      address: body.address || {},
      contact: body.contact || {},
      settings: {
        timezone: body.settings?.timezone || 'Europe/Paris',
        currency: body.settings?.currency || 'EUR',
        language: body.settings?.language || 'fr',
        dateFormat: body.settings?.dateFormat || 'DD/MM/YYYY',
      },
      billing: {
        plan: 'FREE',
        status: 'ACTIVE',
        billingCycle: 'MONTHLY',
        maxUsers: 1,
        maxProjects: 5,
        maxStorage: 1000,
      },
      features: {
        advancedReporting: false,
        customBranding: false,
        apiAccess: false,
        prioritySupport: false,
        whiteLabel: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdById: session.user?.id,
    };

    organizations.push(newOrganization);

    // Ajouter le créateur comme propriétaire
    const ownerMember = {
      id: (organizationMembers.length + 1).toString(),
      userId: session.user?.id,
      organizationId: newOrganization.id,
      role: 'OWNER',
      status: 'ACTIVE',
      permissions: {
        canManageProjects: true,
        canManageContacts: true,
        canManageBudget: true,
        canManageTechnical: true,
        canManagePlanning: true,
        canManageUsers: true,
        canManageBilling: true,
        canViewReports: true,
      },
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    organizationMembers.push(ownerMember);

    return NextResponse.json({ 
      message: 'Organisation créée avec succès',
      organization: newOrganization 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'organisation:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    const organizationIndex = organizations.findIndex(org => org.id === id);
    if (organizationIndex === -1) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 404 });
    }

    // Vérifier les permissions
    const membership = organizationMembers.find(
      member => member.organizationId === id && member.userId === session.user?.id
    );

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      return NextResponse.json({ message: 'Permissions insuffisantes' }, { status: 403 });
    }

    organizations[organizationIndex] = {
      ...organizations[organizationIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ 
      message: 'Organisation mise à jour avec succès',
      organization: organizations[organizationIndex] 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'organisation:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    const organizationIndex = organizations.findIndex(org => org.id === id);
    if (organizationIndex === -1) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 404 });
    }

    // Vérifier que l'utilisateur est propriétaire
    const membership = organizationMembers.find(
      member => member.organizationId === id && member.userId === session.user?.id
    );

    if (!membership || membership.role !== 'OWNER') {
      return NextResponse.json({ message: 'Seul le propriétaire peut supprimer l\'organisation' }, { status: 403 });
    }

    // Supprimer l'organisation et ses membres
    organizations.splice(organizationIndex, 1);
    organizationMembers = organizationMembers.filter(member => member.organizationId !== id);

    return NextResponse.json({ message: 'Organisation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'organisation:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
