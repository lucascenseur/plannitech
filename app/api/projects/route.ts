import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncProjectToEvent } from "@/app/api/events/route";

// Stockage temporaire en mémoire (en production, utiliser une vraie base de données)
let projects: any[] = [];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

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
    
    const newProject = {
      id: (projects.length + 1).toString(),
      name: body.name,
      description: body.description || '',
      type: body.type || 'AUTRE',
      status: 'PLANNING',
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      budget: body.budget || 0,
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