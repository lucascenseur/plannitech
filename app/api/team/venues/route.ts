import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { PlanLimitsManager } from "@/lib/plan-limits";
import { venueSchema } from "@/types/team";

const prisma = new PrismaClient();

// Récupérer tous les lieux
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

    // Récupérer les lieux depuis la base de données
    const venues = await prisma.venue.findMany({
      where: { organizationId: userOrgId },
      include: {
        _count: {
          select: {
            projects: true,
            planningItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer les statistiques pour chaque lieu
    const venuesWithStats = venues.map(venue => ({
      ...venue,
      totalBookings: venue._count.projects + venue._count.planningItems,
      totalRevenue: (venue._count.projects + venue._count.planningItems) * (venue.hourlyRate || 0),
    }));

    return NextResponse.json({ venues: venuesWithStats });
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Ajouter un nouveau lieu
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
    const validatedData = venueSchema.parse(body);

    // Vérifier les limites du plan
    const limitsManager = new PlanLimitsManager(userOrgId);
    const canAddContact = await limitsManager.canAddContact(); // Utiliser la même limite que les contacts
    
    if (!canAddContact.allowed) {
      return NextResponse.json({ 
        message: canAddContact.reason,
        error: 'PLAN_LIMIT_EXCEEDED'
      }, { status: 403 });
    }

    // Créer le lieu
    const newVenue = await prisma.venue.create({
      data: {
        name: validatedData.name,
        description: validatedData.technicalInfo || '',
        address: validatedData.address,
        city: validatedData.city,
        postalCode: validatedData.postalCode,
        country: 'France', // Par défaut
        capacity: validatedData.capacity,
        technicalInfo: validatedData.technicalInfo || '',
        contactName: validatedData.contactName || '',
        contactPhone: validatedData.contactPhone || '',
        contactEmail: validatedData.contactEmail || '',
        website: '', // Pas dans le schéma actuel
        organizationId: userOrgId,
        // Stocker les données supplémentaires dans metadata
        metadata: {
          type: validatedData.type,
          hourlyRate: validatedData.hourlyRate,
          notes: validatedData.notes,
        }
      },
      include: {
        _count: {
          select: {
            projects: true,
            planningItems: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Lieu créé avec succès',
      venue: {
        ...newVenue,
        type: validatedData.type,
        hourlyRate: validatedData.hourlyRate,
        notes: validatedData.notes,
        totalBookings: 0,
        totalRevenue: 0,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du lieu:', error);
    
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

// Mettre à jour un lieu
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
    const validatedData = venueSchema.partial().parse(updateData);

    // Vérifier que le lieu existe et appartient à l'organisation
    const existingVenue = await prisma.venue.findFirst({
      where: {
        id: id,
        organizationId: userOrgId
      }
    });

    if (!existingVenue) {
      return NextResponse.json({ message: 'Lieu non trouvé' }, { status: 404 });
    }

    // Mettre à jour le lieu
    const updatedVenue = await prisma.venue.update({
      where: { id: id },
      data: {
        name: validatedData.name || existingVenue.name,
        description: validatedData.technicalInfo || existingVenue.description,
        address: validatedData.address || existingVenue.address,
        city: validatedData.city || existingVenue.city,
        postalCode: validatedData.postalCode || existingVenue.postalCode,
        capacity: validatedData.capacity || existingVenue.capacity,
        technicalInfo: validatedData.technicalInfo || existingVenue.technicalInfo,
        contactName: validatedData.contactName || existingVenue.contactName,
        contactPhone: validatedData.contactPhone || existingVenue.contactPhone,
        contactEmail: validatedData.contactEmail || existingVenue.contactEmail,
        metadata: {
          ...(existingVenue.metadata as any || {}),
          type: validatedData.type,
          hourlyRate: validatedData.hourlyRate,
          notes: validatedData.notes,
        }
      },
      include: {
        _count: {
          select: {
            projects: true,
            planningItems: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Lieu mis à jour avec succès',
      venue: {
        ...updatedVenue,
        type: validatedData.type || (updatedVenue.metadata as any)?.type,
        hourlyRate: validatedData.hourlyRate || (updatedVenue.metadata as any)?.hourlyRate,
        notes: validatedData.notes || (updatedVenue.metadata as any)?.notes,
        totalBookings: updatedVenue._count.projects + updatedVenue._count.planningItems,
        totalRevenue: (updatedVenue._count.projects + updatedVenue._count.planningItems) * ((updatedVenue.metadata as any)?.hourlyRate || 0),
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du lieu:', error);
    
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

// Supprimer un lieu
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
      return NextResponse.json({ message: 'ID du lieu requis' }, { status: 400 });
    }

    // Vérifier que le lieu existe et appartient à l'organisation
    const existingVenue = await prisma.venue.findFirst({
      where: {
        id: id,
        organizationId: userOrgId
      }
    });

    if (!existingVenue) {
      return NextResponse.json({ message: 'Lieu non trouvé' }, { status: 404 });
    }

    // Supprimer le lieu
    await prisma.venue.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Lieu supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du lieu:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
