import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Stockage temporaire des événements en mémoire
let events: any[] = [];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
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
    
    const newEvent = {
      id: (events.length + 1).toString(),
      title: body.title,
      description: body.description || '',
      startDate: body.startDate,
      endDate: body.endDate,
      type: body.type || 'EVENT',
      status: 'PLANNED',
      projectId: body.projectId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    events.push(newEvent);

    return NextResponse.json({ 
      message: 'Événement créé avec succès',
      event: newEvent 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Fonction pour synchroniser les projets avec les événements
export function syncProjectToEvent(project: any) {
  if (project.startDate) {
    const existingEvent = events.find(e => e.projectId === project.id);
    if (!existingEvent) {
      const newEvent = {
        id: `event-${project.id}`,
        title: project.name,
        description: project.description || '',
        startDate: project.startDate,
        endDate: project.endDate || project.startDate,
        type: 'PROJECT',
        status: 'PLANNED',
        projectId: project.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      events.push(newEvent);
    }
  }
}
