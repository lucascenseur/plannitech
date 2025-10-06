import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Stockage temporaire en mémoire (partagé avec organizations/route.ts)
let organizationMembers: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Vérifier que l'utilisateur a accès à cette organisation
    const userMembership = organizationMembers.find(
      member => member.organizationId === id && member.userId === session.user?.id
    );

    if (!userMembership) {
      return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
    }

    // Récupérer tous les membres de l'organisation
    const members = organizationMembers.filter(member => member.organizationId === id);

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Vérifier les permissions
    const userMembership = organizationMembers.find(
      member => member.organizationId === id && member.userId === session.user?.id
    );

    if (!userMembership || !['OWNER', 'ADMIN'].includes(userMembership.role)) {
      return NextResponse.json({ message: 'Permissions insuffisantes' }, { status: 403 });
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = organizationMembers.find(
      member => member.organizationId === id && member.userId === body.userId
    );

    if (existingMember) {
      return NextResponse.json({ message: 'Cet utilisateur est déjà membre' }, { status: 409 });
    }

    const newMember = {
      id: (organizationMembers.length + 1).toString(),
      userId: body.userId,
      organizationId: id,
      role: body.role || 'MEMBER',
      status: 'INVITED',
      permissions: {
        canManageProjects: body.role === 'ADMIN' || body.role === 'MANAGER',
        canManageContacts: body.role === 'ADMIN' || body.role === 'MANAGER',
        canManageBudget: body.role === 'ADMIN' || body.role === 'MANAGER',
        canManageTechnical: body.role === 'ADMIN' || body.role === 'MANAGER',
        canManagePlanning: true,
        canManageUsers: body.role === 'ADMIN',
        canManageBilling: body.role === 'OWNER',
        canViewReports: body.role !== 'VIEWER',
      },
      invitedAt: new Date().toISOString(),
      invitedBy: session.user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    organizationMembers.push(newMember);

    return NextResponse.json({ 
      message: 'Membre ajouté avec succès',
      member: newMember 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { memberId, ...updateData } = body;

    // Vérifier les permissions
    const userMembership = organizationMembers.find(
      member => member.organizationId === id && member.userId === session.user?.id
    );

    if (!userMembership || !['OWNER', 'ADMIN'].includes(userMembership.role)) {
      return NextResponse.json({ message: 'Permissions insuffisantes' }, { status: 403 });
    }

    const memberIndex = organizationMembers.findIndex(
      member => member.id === memberId && member.organizationId === id
    );

    if (memberIndex === -1) {
      return NextResponse.json({ message: 'Membre non trouvé' }, { status: 404 });
    }

    // Mettre à jour les permissions selon le rôle
    if (updateData.role) {
      updateData.permissions = {
        canManageProjects: updateData.role === 'ADMIN' || updateData.role === 'MANAGER',
        canManageContacts: updateData.role === 'ADMIN' || updateData.role === 'MANAGER',
        canManageBudget: updateData.role === 'ADMIN' || updateData.role === 'MANAGER',
        canManageTechnical: updateData.role === 'ADMIN' || updateData.role === 'MANAGER',
        canManagePlanning: true,
        canManageUsers: updateData.role === 'ADMIN',
        canManageBilling: updateData.role === 'OWNER',
        canViewReports: updateData.role !== 'VIEWER',
      };
    }

    organizationMembers[memberIndex] = {
      ...organizationMembers[memberIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ 
      message: 'Membre mis à jour avec succès',
      member: organizationMembers[memberIndex] 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ message: 'ID du membre requis' }, { status: 400 });
    }

    // Vérifier les permissions
    const userMembership = organizationMembers.find(
      member => member.organizationId === id && member.userId === session.user?.id
    );

    if (!userMembership || !['OWNER', 'ADMIN'].includes(userMembership.role)) {
      return NextResponse.json({ message: 'Permissions insuffisantes' }, { status: 403 });
    }

    const memberIndex = organizationMembers.findIndex(
      member => member.id === memberId && member.organizationId === id
    );

    if (memberIndex === -1) {
      return NextResponse.json({ message: 'Membre non trouvé' }, { status: 404 });
    }

    // Empêcher la suppression du propriétaire
    if (organizationMembers[memberIndex].role === 'OWNER') {
      return NextResponse.json({ message: 'Le propriétaire ne peut pas être supprimé' }, { status: 403 });
    }

    organizationMembers.splice(memberIndex, 1);

    return NextResponse.json({ message: 'Membre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
