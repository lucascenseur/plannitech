import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer l'organisation de l'utilisateur
    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    // Récupérer les projets depuis la base de données
    const projects = await prisma.project.findMany({
      where: { organizationId: userOrgId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        contacts: {
          include: {
            contact: {
              select: { id: true, name: true, email: true, type: true }
            }
          }
        },
        _count: {
          select: {
            contacts: true,
            budgetItems: true,
            planningItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
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
    const { name, description, type, status, startDate, endDate, budget } = body;
    
    // Récupérer l'organisation de l'utilisateur
    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    // Créer le projet dans la base de données
    const newProject = await prisma.project.create({
      data: {
        title: name,
        description: description || '',
        type: type || 'OTHER',
        status: status || 'PLANNING',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? parseFloat(budget) : null,
        organizationId: userOrgId,
        createdById: session.user?.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            contacts: true,
            budgetItems: true,
            planningItems: true
          }
        }
      }
    });

    // Créer un événement de planning si le projet a une date de début
    if (newProject.startDate) {
      await prisma.planningItem.create({
        data: {
          title: `Événement - ${newProject.title}`,
          description: `Événement lié au projet ${newProject.title}`,
          type: 'PERFORMANCE',
          startDate: newProject.startDate,
          endDate: newProject.endDate || newProject.startDate,
          status: 'SCHEDULED',
          projectId: newProject.id,
          organizationId: userOrgId,
          createdById: session.user?.id,
        }
      });
    }

    return NextResponse.json({ 
      message: 'Projet créé avec succès',
      project: newProject 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
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

    const projectIndex = projects.findIndex(project => project.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ message: 'Projet non trouvé' }, { status: 404 });
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Synchroniser avec les événements si la date a changé
    if (updateData.startDate) {
      syncProjectToEvent(projects[projectIndex]);
    }

    return NextResponse.json({ 
      message: 'Projet mis à jour avec succès',
      project: projects[projectIndex] 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
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

    const projectIndex = projects.findIndex(project => project.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ message: 'Projet non trouvé' }, { status: 404 });
    }

    projects.splice(projectIndex, 1);

    return NextResponse.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}