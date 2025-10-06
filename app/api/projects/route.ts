import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncProjectToEvent } from "@/app/api/events/route";

// Stockage temporaire en mémoire (isolé par organisation)
let projects: any[] = [];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Filtrer les projets par organisation de l'utilisateur
    const userOrgId = session.user?.organizations?.[0]?.organizationId || '1';
    const userProjects = projects.filter(project => project.organizationId === userOrgId);

    return NextResponse.json({ projects: userProjects });
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
    
    const newProject = {
      id: (projects.length + 1).toString(),
      name: body.name,
      description: body.description || '',
      type: body.type || 'AUTRE',
      status: body.status || 'PLANNING',
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      budget: body.budget || 0,
      organizationId: session.user?.organizations?.[0]?.organizationId || '1',
      createdById: session.user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);

    // Synchroniser avec les événements si le projet a une date
    if (newProject.startDate) {
      syncProjectToEvent(newProject);
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