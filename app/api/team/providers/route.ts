import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { PlanLimitsManager } from "@/lib/plan-limits";
import { providerSchema } from "@/types/team";

const prisma = new PrismaClient();

// Récupérer tous les prestataires
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

    // Récupérer les prestataires depuis la base de données
    const providers = await prisma.contact.findMany({
      where: { 
        organizationId: userOrgId,
        type: 'PROVIDER' // Filtrer les prestataires
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

    // Calculer les statistiques pour chaque prestataire
    const providersWithStats = providers.map(provider => {
      const totalHours = provider._count.projects * 8; // 8h par projet en moyenne
      const totalEarnings = totalHours * (provider.hourlyRate || 0);
      
      return {
        ...provider,
        totalHoursWorked: totalHours,
        totalEarnings: totalEarnings,
        // Mapper les champs pour correspondre au nouveau schéma
        type: (provider.metadata as any)?.type || 'OTHER',
        equipment: (provider.metadata as any)?.equipment || [],
        skills: (provider.metadata as any)?.skills || [],
        notes: provider.description || '',
      };
    });

    return NextResponse.json({ providers: providersWithStats });
  } catch (error) {
    console.error('Erreur lors de la récupération des prestataires:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Ajouter un nouveau prestataire
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
    const validatedData = providerSchema.parse(body);

    // Vérifier les limites du plan
    const limitsManager = new PlanLimitsManager(userOrgId);
    const canAddContact = await limitsManager.canAddContact();
    
    if (!canAddContact.allowed) {
      return NextResponse.json({ 
        message: canAddContact.reason,
        error: 'PLAN_LIMIT_EXCEEDED'
      }, { status: 403 });
    }

    // Créer le prestataire
    const newProvider = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.contactEmail || '',
        phone: validatedData.contactPhone || '',
        type: 'PROVIDER',
        description: validatedData.notes || '',
        website: '', // Pas dans le schéma actuel
        organizationId: userOrgId,
        createdById: session.user?.id,
        // Stocker les données supplémentaires dans metadata
        metadata: {
          type: validatedData.type,
          contactName: validatedData.contactName,
          address: validatedData.address,
          siret: validatedData.siret,
          hourlyRate: validatedData.hourlyRate,
          equipment: validatedData.equipment,
          skills: validatedData.skills,
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
      message: 'Prestataire ajouté avec succès',
      provider: {
        ...newProvider,
        type: validatedData.type,
        contactName: validatedData.contactName,
        address: validatedData.address,
        siret: validatedData.siret,
        hourlyRate: validatedData.hourlyRate,
        equipment: validatedData.equipment,
        skills: validatedData.skills,
        notes: validatedData.notes,
        totalHoursWorked: 0,
        totalEarnings: 0,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du prestataire:', error);
    
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

// Mettre à jour un prestataire
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
    const validatedData = providerSchema.partial().parse(updateData);

    // Vérifier que le prestataire existe et appartient à l'organisation
    const existingProvider = await prisma.contact.findFirst({
      where: {
        id: id,
        organizationId: userOrgId,
        type: 'PROVIDER'
      }
    });

    if (!existingProvider) {
      return NextResponse.json({ message: 'Prestataire non trouvé' }, { status: 404 });
    }

    // Mettre à jour le prestataire
    const updatedProvider = await prisma.contact.update({
      where: { id: id },
      data: {
        name: validatedData.name || existingProvider.name,
        email: validatedData.contactEmail || existingProvider.email,
        phone: validatedData.contactPhone || existingProvider.phone,
        description: validatedData.notes || existingProvider.description,
        metadata: {
          ...(existingProvider.metadata as any || {}),
          type: validatedData.type,
          contactName: validatedData.contactName,
          address: validatedData.address,
          siret: validatedData.siret,
          hourlyRate: validatedData.hourlyRate,
          equipment: validatedData.equipment,
          skills: validatedData.skills,
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
      message: 'Prestataire mis à jour avec succès',
      provider: {
        ...updatedProvider,
        type: validatedData.type || (updatedProvider.metadata as any)?.type,
        contactName: validatedData.contactName || (updatedProvider.metadata as any)?.contactName,
        address: validatedData.address || (updatedProvider.metadata as any)?.address,
        siret: validatedData.siret || (updatedProvider.metadata as any)?.siret,
        hourlyRate: validatedData.hourlyRate || (updatedProvider.metadata as any)?.hourlyRate,
        equipment: validatedData.equipment || (updatedProvider.metadata as any)?.equipment || [],
        skills: validatedData.skills || (updatedProvider.metadata as any)?.skills || [],
        notes: validatedData.notes || updatedProvider.description,
        totalHoursWorked: updatedProvider._count.projects * 8,
        totalEarnings: (updatedProvider._count.projects * 8) * ((updatedProvider.metadata as any)?.hourlyRate || 0),
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du prestataire:', error);
    
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

// Supprimer un prestataire
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
      return NextResponse.json({ message: 'ID du prestataire requis' }, { status: 400 });
    }

    // Vérifier que le prestataire existe et appartient à l'organisation
    const existingProvider = await prisma.contact.findFirst({
      where: {
        id: id,
        organizationId: userOrgId,
        type: 'PROVIDER'
      }
    });

    if (!existingProvider) {
      return NextResponse.json({ message: 'Prestataire non trouvé' }, { status: 404 });
    }

    // Supprimer le prestataire
    await prisma.contact.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Prestataire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du prestataire:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
