import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { PlanLimitsManager } from "@/lib/plan-limits";
import { taskTemplateSchema } from "@/types/team";

const prisma = new PrismaClient();

// Récupérer tous les templates de tâches
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

    // Récupérer les templates depuis la base de données
    const templates = await prisma.taskTemplate.findMany({
      where: { organizationId: userOrgId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Erreur lors de la récupération des templates:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Créer un nouveau template de tâche
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
    const validatedData = taskTemplateSchema.parse(body);

    // Vérifier les limites du plan
    const limitsManager = new PlanLimitsManager(userOrgId);
    const canCreateProject = await limitsManager.canCreateProject(); // Utiliser la même limite que les projets
    
    if (!canCreateProject.allowed) {
      return NextResponse.json({ 
        message: canCreateProject.reason,
        error: 'PLAN_LIMIT_EXCEEDED'
      }, { status: 403 });
    }

    // Créer le template
    const newTemplate = await prisma.taskTemplate.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        type: validatedData.type,
        priority: validatedData.priority,
        duration: validatedData.duration,
        startTime: validatedData.startTime || '',
        endTime: validatedData.endTime || '',
        organizationId: userOrgId,
        createdById: session.user?.id,
        // Stocker les données supplémentaires dans metadata
        metadata: {
          defaultVenueId: validatedData.defaultVenueId,
          defaultMembers: validatedData.defaultMembers,
          defaultProviders: validatedData.defaultProviders,
          requirements: validatedData.requirements,
          notes: validatedData.notes,
          category: validatedData.category,
          isRecurring: validatedData.isRecurring,
          recurringPattern: validatedData.recurringPattern,
          tags: validatedData.tags,
          usageCount: 0,
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Template créé avec succès',
      template: {
        ...newTemplate,
        defaultVenueId: validatedData.defaultVenueId,
        defaultMembers: validatedData.defaultMembers,
        defaultProviders: validatedData.defaultProviders,
        requirements: validatedData.requirements,
        notes: validatedData.notes,
        category: validatedData.category,
        isRecurring: validatedData.isRecurring,
        recurringPattern: validatedData.recurringPattern,
        tags: validatedData.tags,
        usageCount: 0,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du template:', error);
    
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

// Mettre à jour un template
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
    const validatedData = taskTemplateSchema.partial().parse(updateData);

    // Vérifier que le template existe et appartient à l'organisation
    const existingTemplate = await prisma.taskTemplate.findFirst({
      where: {
        id: id,
        organizationId: userOrgId
      }
    });

    if (!existingTemplate) {
      return NextResponse.json({ message: 'Template non trouvé' }, { status: 404 });
    }

    // Mettre à jour le template
    const updatedTemplate = await prisma.taskTemplate.update({
      where: { id: id },
      data: {
        name: validatedData.name || existingTemplate.name,
        description: validatedData.description || existingTemplate.description,
        type: validatedData.type || existingTemplate.type,
        priority: validatedData.priority || existingTemplate.priority,
        duration: validatedData.duration || existingTemplate.duration,
        startTime: validatedData.startTime || existingTemplate.startTime,
        endTime: validatedData.endTime || existingTemplate.endTime,
        metadata: {
          ...(existingTemplate.metadata as any || {}),
          defaultVenueId: validatedData.defaultVenueId,
          defaultMembers: validatedData.defaultMembers,
          defaultProviders: validatedData.defaultProviders,
          requirements: validatedData.requirements,
          notes: validatedData.notes,
          category: validatedData.category,
          isRecurring: validatedData.isRecurring,
          recurringPattern: validatedData.recurringPattern,
          tags: validatedData.tags,
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Template mis à jour avec succès',
      template: {
        ...updatedTemplate,
        defaultVenueId: validatedData.defaultVenueId || (updatedTemplate.metadata as any)?.defaultVenueId,
        defaultMembers: validatedData.defaultMembers || (updatedTemplate.metadata as any)?.defaultMembers || [],
        defaultProviders: validatedData.defaultProviders || (updatedTemplate.metadata as any)?.defaultProviders || [],
        requirements: validatedData.requirements || (updatedTemplate.metadata as any)?.requirements || [],
        notes: validatedData.notes || (updatedTemplate.metadata as any)?.notes || '',
        category: validatedData.category || (updatedTemplate.metadata as any)?.category,
        isRecurring: validatedData.isRecurring || (updatedTemplate.metadata as any)?.isRecurring || false,
        recurringPattern: validatedData.recurringPattern || (updatedTemplate.metadata as any)?.recurringPattern,
        tags: validatedData.tags || (updatedTemplate.metadata as any)?.tags || [],
        usageCount: (updatedTemplate.metadata as any)?.usageCount || 0,
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du template:', error);
    
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

// Supprimer un template
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
      return NextResponse.json({ message: 'ID du template requis' }, { status: 400 });
    }

    // Vérifier que le template existe et appartient à l'organisation
    const existingTemplate = await prisma.taskTemplate.findFirst({
      where: {
        id: id,
        organizationId: userOrgId
      }
    });

    if (!existingTemplate) {
      return NextResponse.json({ message: 'Template non trouvé' }, { status: 404 });
    }

    // Supprimer le template
    await prisma.taskTemplate.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Template supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du template:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
