import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { PlanLimitsManager } from "@/lib/plan-limits";
import { teamMemberSchema } from "@/types/team";

const prisma = new PrismaClient();

// Récupérer tous les membres de l'équipe
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    // Récupérer les membres de l'équipe depuis la base de données
    const members = await prisma.contact.findMany({
      where: { 
        organizationId: userOrgId,
        type: { in: ['ARTIST', 'TECHNICIAN'] } // Filtrer les membres d'équipe
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            projects: true,
            budgetItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer les statistiques pour chaque membre
    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        // Calculer les heures totales travaillées (approximation)
        const totalHours = member._count.projects * 8; // 8h par projet en moyenne
        
        // Calculer les gains totaux
        const totalEarnings = totalHours * (member.hourlyRate || 0);

        return {
          ...member,
          totalHoursWorked: totalHours,
          totalEarnings: totalEarnings,
          // Mapper les champs pour correspondre au nouveau schéma
          role: member.type,
          skills: member.skills || [],
          availability: member.availability || {},
          notes: member.description || '',
        };
      })
    );

    return NextResponse.json({ members: membersWithStats });
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Ajouter un nouveau membre à l'équipe
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    const body = await request.json();
    
    // Valider les données avec Zod
    const validatedData = teamMemberSchema.parse(body);

    // Vérifier les limites du plan
    const limitsManager = new PlanLimitsManager(userOrgId);
    const canAddContact = await limitsManager.canAddContact();
    
    if (!canAddContact.allowed) {
      return NextResponse.json({ 
        message: canAddContact.reason,
        error: 'PLAN_LIMIT_EXCEEDED'
      }, { status: 403 });
    }

    // Créer le membre de l'équipe
    const newMember = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || '',
        type: validatedData.role === 'MANAGER' ? 'ARTIST' : 'TECHNICIAN',
        description: validatedData.notes || '',
        isIntermittent: validatedData.isIntermittent,
        intermittentNumber: validatedData.intermittentNumber || '',
        organizationId: userOrgId,
        createdById: session.user?.id,
        // Stocker les données supplémentaires dans metadata
        metadata: {
          role: validatedData.role,
          status: validatedData.status,
          hourlyRate: validatedData.hourlyRate,
          skills: validatedData.skills,
          availability: validatedData.availability,
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            projects: true,
            budgetItems: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Membre ajouté à l\'équipe avec succès',
      member: {
        ...newMember,
        role: validatedData.role,
        status: validatedData.status,
        hourlyRate: validatedData.hourlyRate,
        skills: validatedData.skills,
        availability: validatedData.availability,
        notes: validatedData.notes,
        totalHoursWorked: 0,
        totalEarnings: 0,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ 
        message: 'Données invalides',
        errors: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Mettre à jour un membre de l'équipe
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    // Valider les données avec Zod
    const validatedData = teamMemberSchema.partial().parse(updateData);

    // Vérifier que le membre existe et appartient à l'organisation
    const existingMember = await prisma.contact.findFirst({
      where: {
        id: id,
        organizationId: userOrgId
      }
    });

    if (!existingMember) {
      return NextResponse.json({ message: 'Membre non trouvé' }, { status: 404 });
    }

    // Mettre à jour le membre
    const updatedMember = await prisma.contact.update({
      where: { id: id },
      data: {
        name: validatedData.name || existingMember.name,
        email: validatedData.email || existingMember.email,
        phone: validatedData.phone || existingMember.phone,
        type: validatedData.role === 'MANAGER' ? 'ARTIST' : 'TECHNICIAN',
        description: validatedData.notes || existingMember.description,
        isIntermittent: validatedData.isIntermittent ?? existingMember.isIntermittent,
        intermittentNumber: validatedData.intermittentNumber || existingMember.intermittentNumber,
        metadata: {
          ...(existingMember.metadata as any || {}),
          role: validatedData.role,
          status: validatedData.status,
          hourlyRate: validatedData.hourlyRate,
          skills: validatedData.skills,
          availability: validatedData.availability,
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            projects: true,
            budgetItems: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Membre mis à jour avec succès',
      member: {
        ...updatedMember,
        role: validatedData.role || (updatedMember.metadata as any)?.role,
        status: validatedData.status || (updatedMember.metadata as any)?.status,
        hourlyRate: validatedData.hourlyRate || (updatedMember.metadata as any)?.hourlyRate,
        skills: validatedData.skills || (updatedMember.metadata as any)?.skills || [],
        availability: validatedData.availability || (updatedMember.metadata as any)?.availability || {},
        notes: validatedData.notes || updatedMember.description,
        totalHoursWorked: updatedMember._count.projects * 8,
        totalEarnings: (updatedMember._count.projects * 8) * ((updatedMember.metadata as any)?.hourlyRate || 0),
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ 
        message: 'Données invalides',
        errors: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Supprimer un membre de l'équipe
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID du membre requis' }, { status: 400 });
    }

    // Vérifier que le membre existe et appartient à l'organisation
    const existingMember = await prisma.contact.findFirst({
      where: {
        id: id,
        organizationId: userOrgId
      }
    });

    if (!existingMember) {
      return NextResponse.json({ message: 'Membre non trouvé' }, { status: 404 });
    }

    // Supprimer le membre
    await prisma.contact.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Membre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
