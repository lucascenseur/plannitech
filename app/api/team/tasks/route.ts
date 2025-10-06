import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { PlanLimitsManager } from "@/lib/plan-limits";
import { taskSchema } from "@/types/team";
import { frenchLaborCalculator } from "@/lib/french-labor-calculations";

const prisma = new PrismaClient();

// Récupérer toutes les tâches
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

    // Récupérer les tâches depuis la base de données
    const tasks = await prisma.task.findMany({
      where: { organizationId: userOrgId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        assignedMembers: {
          include: {
            contact: {
              select: { id: true, name: true, email: true, type: true }
            }
          }
        },
        assignedProviders: {
          include: {
            contact: {
              select: { id: true, name: true, email: true, type: true }
            }
          }
        },
        venue: {
          select: { id: true, name: true, address: true }
        },
        project: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer les coûts et heures pour chaque tâche
    const tasksWithCalculations = await Promise.all(
      tasks.map(async (task) => {
        let totalCost = 0;
        let totalHours = 0;
        let laborCalculations: any[] = [];

        // Calculer les coûts des membres assignés
        for (const assignment of task.assignedMembers) {
          const member = assignment.contact;
          const hourlyRate = (member as any).hourlyRate || 0;
          const hours = task.actualHours || task.estimatedHours || 0;
          
          if (hours > 0 && hourlyRate > 0) {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
            const isIntermittent = (member as any).isIntermittent || false;
            
            // Calculer selon la législation française
            const calculation = frenchLaborCalculator.calculateTimeAndPay(
              startDate,
              endDate,
              hourlyRate,
              isIntermittent
            );
            
            laborCalculations.push({
              memberId: member.id,
              memberName: member.name,
              calculation,
              socialCharges: frenchLaborCalculator.calculateSocialCharges(calculation.totalPay, isIntermittent)
            });
            
            totalCost += calculation.totalPay;
            totalHours += calculation.totalHours;
          }
        }

        // Calculer les coûts des prestataires assignés
        for (const assignment of task.assignedProviders) {
          const provider = assignment.contact;
          const hourlyRate = (provider as any).hourlyRate || 0;
          const hours = task.actualHours || task.estimatedHours || 0;
          
          if (hours > 0 && hourlyRate > 0) {
            totalCost += hours * hourlyRate;
            totalHours += hours;
          }
        }

        return {
          ...task,
          totalCost,
          totalHours,
          laborCalculations,
          assignedMembers: task.assignedMembers.map(a => ({
            id: a.contact.id,
            name: a.contact.name,
            email: a.contact.email,
            type: a.contact.type,
            hourlyRate: (a.contact as any).hourlyRate || 0,
            isIntermittent: (a.contact as any).isIntermittent || false,
          })),
          assignedProviders: task.assignedProviders.map(a => ({
            id: a.contact.id,
            name: a.contact.name,
            email: a.contact.email,
            type: a.contact.type,
            hourlyRate: (a.contact as any).hourlyRate || 0,
          })),
        };
      })
    );

    return NextResponse.json({ tasks: tasksWithCalculations });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Créer une nouvelle tâche
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
    const validatedData = taskSchema.parse(body);

    // Vérifier les limites du plan
    const limitsManager = new PlanLimitsManager(userOrgId);
    const canCreateProject = await limitsManager.canCreateProject(); // Utiliser la même limite que les projets
    
    if (!canCreateProject.allowed) {
      return NextResponse.json({ 
        message: canCreateProject.reason,
        error: 'PLAN_LIMIT_EXCEEDED'
      }, { status: 403 });
    }

    // Créer la tâche
    const newTask = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || '',
        type: validatedData.type,
        priority: validatedData.priority,
        status: validatedData.status,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        estimatedHours: validatedData.estimatedHours,
        actualHours: validatedData.actualHours,
        organizationId: userOrgId,
        createdById: session.user?.id,
        venueId: validatedData.venueId,
        projectId: validatedData.projectId,
        // Stocker les données supplémentaires dans metadata
        metadata: {
          requirements: validatedData.requirements,
          notes: validatedData.notes,
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        venue: {
          select: { id: true, name: true, address: true }
        },
        project: {
          select: { id: true, title: true }
        }
      }
    });

    // Assigner les membres si spécifiés
    if (validatedData.assignedMembers && validatedData.assignedMembers.length > 0) {
      await Promise.all(
        validatedData.assignedMembers.map(memberId =>
          prisma.taskAssignment.create({
            data: {
              taskId: newTask.id,
              contactId: memberId,
              type: 'MEMBER',
              organizationId: userOrgId,
            }
          })
        )
      );
    }

    // Assigner les prestataires si spécifiés
    if (validatedData.assignedProviders && validatedData.assignedProviders.length > 0) {
      await Promise.all(
        validatedData.assignedProviders.map(providerId =>
          prisma.taskAssignment.create({
            data: {
              taskId: newTask.id,
              contactId: providerId,
              type: 'PROVIDER',
              organizationId: userOrgId,
            }
          })
        )
      );
    }

    return NextResponse.json({ 
      message: 'Tâche créée avec succès',
      task: {
        ...newTask,
        requirements: validatedData.requirements,
        notes: validatedData.notes,
        assignedMembers: [],
        assignedProviders: [],
        totalCost: 0,
        totalHours: validatedData.estimatedHours || 0,
        laborCalculations: [],
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    
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

// Mettre à jour une tâche
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
    const validatedData = taskSchema.partial().parse(updateData);

    // Vérifier que la tâche existe et appartient à l'organisation
    const existingTask = await prisma.task.findFirst({
      where: {
        id: id,
        organizationId: userOrgId
      }
    });

    if (!existingTask) {
      return NextResponse.json({ message: 'Tâche non trouvée' }, { status: 404 });
    }

    // Mettre à jour la tâche
    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: {
        title: validatedData.title || existingTask.title,
        description: validatedData.description || existingTask.description,
        type: validatedData.type || existingTask.type,
        priority: validatedData.priority || existingTask.priority,
        status: validatedData.status || existingTask.status,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : existingTask.startDate,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : existingTask.endDate,
        estimatedHours: validatedData.estimatedHours || existingTask.estimatedHours,
        actualHours: validatedData.actualHours || existingTask.actualHours,
        venueId: validatedData.venueId || existingTask.venueId,
        projectId: validatedData.projectId || existingTask.projectId,
        metadata: {
          ...(existingTask.metadata as any || {}),
          requirements: validatedData.requirements,
          notes: validatedData.notes,
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        venue: {
          select: { id: true, name: true, address: true }
        },
        project: {
          select: { id: true, title: true }
        }
      }
    });

    // Mettre à jour les assignations si spécifiées
    if (validatedData.assignedMembers !== undefined) {
      // Supprimer les anciennes assignations de membres
      await prisma.taskAssignment.deleteMany({
        where: {
          taskId: id,
          type: 'MEMBER'
        }
      });

      // Créer les nouvelles assignations
      if (validatedData.assignedMembers.length > 0) {
        await Promise.all(
          validatedData.assignedMembers.map(memberId =>
            prisma.taskAssignment.create({
              data: {
                taskId: id,
                contactId: memberId,
                type: 'MEMBER',
                organizationId: userOrgId,
              }
            })
          )
        );
      }
    }

    if (validatedData.assignedProviders !== undefined) {
      // Supprimer les anciennes assignations de prestataires
      await prisma.taskAssignment.deleteMany({
        where: {
          taskId: id,
          type: 'PROVIDER'
        }
      });

      // Créer les nouvelles assignations
      if (validatedData.assignedProviders.length > 0) {
        await Promise.all(
          validatedData.assignedProviders.map(providerId =>
            prisma.taskAssignment.create({
              data: {
                taskId: id,
                contactId: providerId,
                type: 'PROVIDER',
                organizationId: userOrgId,
              }
            })
          )
        );
      }
    }

    return NextResponse.json({ 
      message: 'Tâche mise à jour avec succès',
      task: {
        ...updatedTask,
        requirements: validatedData.requirements || (updatedTask.metadata as any)?.requirements || [],
        notes: validatedData.notes || (updatedTask.metadata as any)?.notes || '',
        assignedMembers: [],
        assignedProviders: [],
        totalCost: 0,
        totalHours: updatedTask.actualHours || updatedTask.estimatedHours || 0,
        laborCalculations: [],
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    
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

// Supprimer une tâche
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
      return NextResponse.json({ message: 'ID de la tâche requis' }, { status: 400 });
    }

    // Vérifier que la tâche existe et appartient à l'organisation
    const existingTask = await prisma.task.findFirst({
      where: {
        id: id,
        organizationId: userOrgId
      }
    });

    if (!existingTask) {
      return NextResponse.json({ message: 'Tâche non trouvée' }, { status: 404 });
    }

    // Supprimer les assignations d'abord
    await prisma.taskAssignment.deleteMany({
      where: { taskId: id }
    });

    // Supprimer la tâche
    await prisma.task.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
