import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { PlanLimitsManager } from "@/lib/plan-limits";

const prisma = new PrismaClient();

// Créer une tâche à partir d'un template
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    const { id: templateId } = await params;
    const body = await request.json();
    const { 
      startDate, 
      endDate, 
      projectId, 
      venueId, 
      assignedMembers = [], 
      assignedProviders = [],
      customTitle,
      customDescription 
    } = body;

    // Récupérer le template
    const template = await prisma.taskTemplate.findFirst({
      where: {
        id: templateId,
        organizationId: userOrgId
      }
    });

    if (!template) {
      return NextResponse.json({ message: 'Template non trouvé' }, { status: 404 });
    }

    // Vérifier les limites du plan
    const limitsManager = new PlanLimitsManager(userOrgId);
    const canCreateProject = await limitsManager.canCreateProject();
    
    if (!canCreateProject.allowed) {
      return NextResponse.json({ 
        message: canCreateProject.reason,
        error: 'PLAN_LIMIT_EXCEEDED'
      }, { status: 403 });
    }

    // Calculer les dates et heures
    const templateData = template.metadata as any;
    const startDateTime = new Date(startDate);
    const endDateTime = endDate ? new Date(endDate) : new Date(startDateTime.getTime() + (template.duration * 60 * 60 * 1000));

    // Appliquer les heures par défaut si spécifiées
    if (templateData.startTime && templateData.endTime) {
      const [startHour, startMinute] = templateData.startTime.split(':').map(Number);
      const [endHour, endMinute] = templateData.endTime.split(':').map(Number);
      
      startDateTime.setHours(startHour, startMinute, 0, 0);
      endDateTime.setHours(endHour, endMinute, 0, 0);
    }

    // Créer la tâche
    const newTask = await prisma.task.create({
      data: {
        title: customTitle || template.name,
        description: customDescription || template.description,
        type: template.type,
        priority: template.priority,
        status: 'PENDING',
        startDate: startDateTime,
        endDate: endDateTime,
        estimatedHours: template.duration,
        organizationId: userOrgId,
        createdById: session.user?.id,
        venueId: venueId || templateData.defaultVenueId,
        projectId: projectId,
        metadata: {
          requirements: templateData.requirements || [],
          notes: templateData.notes || '',
          createdFromTemplate: templateId,
          templateName: template.name,
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

    // Assigner les membres (priorité aux membres spécifiés, sinon les membres par défaut)
    const membersToAssign = assignedMembers.length > 0 ? assignedMembers : (templateData.defaultMembers || []);
    if (membersToAssign.length > 0) {
      await Promise.all(
        membersToAssign.map(memberId =>
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

    // Assigner les prestataires (priorité aux prestataires spécifiés, sinon les prestataires par défaut)
    const providersToAssign = assignedProviders.length > 0 ? assignedProviders : (templateData.defaultProviders || []);
    if (providersToAssign.length > 0) {
      await Promise.all(
        providersToAssign.map(providerId =>
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

    // Mettre à jour le compteur d'utilisation du template
    await prisma.taskTemplate.update({
      where: { id: templateId },
      data: {
        metadata: {
          ...templateData,
          usageCount: (templateData.usageCount || 0) + 1,
          lastUsed: new Date().toISOString(),
        }
      }
    });

    return NextResponse.json({ 
      message: 'Tâche créée à partir du template avec succès',
      task: {
        ...newTask,
        requirements: templateData.requirements || [],
        notes: templateData.notes || '',
        assignedMembers: [],
        assignedProviders: [],
        totalCost: 0,
        totalHours: template.duration,
        laborCalculations: [],
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche à partir du template:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Créer plusieurs tâches récurrentes à partir d'un template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    const { id: templateId } = await params;
    const body = await request.json();
    const { 
      startDate, 
      endDate, 
      projectId, 
      venueId, 
      assignedMembers = [], 
      assignedProviders = [],
      recurringPattern = 'DAILY',
      occurrences = 7
    } = body;

    // Récupérer le template
    const template = await prisma.taskTemplate.findFirst({
      where: {
        id: templateId,
        organizationId: userOrgId
      }
    });

    if (!template) {
      return NextResponse.json({ message: 'Template non trouvé' }, { status: 404 });
    }

    // Vérifier les limites du plan
    const limitsManager = new PlanLimitsManager(userOrgId);
    const canCreateProject = await limitsManager.canCreateProject();
    
    if (!canCreateProject.allowed) {
      return NextResponse.json({ 
        message: canCreateProject.reason,
        error: 'PLAN_LIMIT_EXCEEDED'
      }, { status: 403 });
    }

    const templateData = template.metadata as any;
    const createdTasks = [];

    // Créer les tâches récurrentes
    for (let i = 0; i < occurrences; i++) {
      const currentStartDate = new Date(startDate);
      
      // Calculer la date selon le pattern
      switch (recurringPattern) {
        case 'DAILY':
          currentStartDate.setDate(currentStartDate.getDate() + i);
          break;
        case 'WEEKLY':
          currentStartDate.setDate(currentStartDate.getDate() + (i * 7));
          break;
        case 'MONTHLY':
          currentStartDate.setMonth(currentStartDate.getMonth() + i);
          break;
      }

      const currentEndDate = new Date(currentStartDate.getTime() + (template.duration * 60 * 60 * 1000));

      // Appliquer les heures par défaut si spécifiées
      if (templateData.startTime && templateData.endTime) {
        const [startHour, startMinute] = templateData.startTime.split(':').map(Number);
        const [endHour, endMinute] = templateData.endTime.split(':').map(Number);
        
        currentStartDate.setHours(startHour, startMinute, 0, 0);
        currentEndDate.setHours(endHour, endMinute, 0, 0);
      }

      // Créer la tâche
      const newTask = await prisma.task.create({
        data: {
          title: `${template.name} (${i + 1})`,
          description: template.description,
          type: template.type,
          priority: template.priority,
          status: 'PENDING',
          startDate: currentStartDate,
          endDate: currentEndDate,
          estimatedHours: template.duration,
          organizationId: userOrgId,
          createdById: session.user?.id,
          venueId: venueId || templateData.defaultVenueId,
          projectId: projectId,
          metadata: {
            requirements: templateData.requirements || [],
            notes: templateData.notes || '',
            createdFromTemplate: templateId,
            templateName: template.name,
            recurringIndex: i + 1,
          }
        }
      });

      // Assigner les membres
      const membersToAssign = assignedMembers.length > 0 ? assignedMembers : (templateData.defaultMembers || []);
      if (membersToAssign.length > 0) {
        await Promise.all(
          membersToAssign.map(memberId =>
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

      // Assigner les prestataires
      const providersToAssign = assignedProviders.length > 0 ? assignedProviders : (templateData.defaultProviders || []);
      if (providersToAssign.length > 0) {
        await Promise.all(
          providersToAssign.map(providerId =>
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

      createdTasks.push(newTask);
    }

    // Mettre à jour le compteur d'utilisation du template
    await prisma.taskTemplate.update({
      where: { id: templateId },
      data: {
        metadata: {
          ...templateData,
          usageCount: (templateData.usageCount || 0) + occurrences,
          lastUsed: new Date().toISOString(),
        }
      }
    });

    return NextResponse.json({ 
      message: `${occurrences} tâches créées à partir du template avec succès`,
      tasks: createdTasks
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création des tâches récurrentes:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
