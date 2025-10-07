import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Types pour le planning
interface PlanningEvent {
  id: string;
  show: string;
  date: string;
  type: string;
  status: 'confirmed' | 'planning' | 'draft' | 'cancelled';
  timeline: {
    time: string;
    task: string;
    team: string;
    duration: number;
    status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  }[];
  team: {
    total: number;
    sound: number;
    lighting: number;
    stage: number;
    security: number;
    catering: number;
    artists: number;
  };
  equipment: {
    sound: string;
    lighting: string;
    stage: string;
  };
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// Données d'exemple (sera remplacé par la base de données)
let planningEvents: PlanningEvent[] = [
  {
    id: '1',
    show: 'Concert Jazz au Théâtre Municipal',
    date: '2024-02-15',
    type: 'show',
    status: 'confirmed',
    timeline: [
      { time: '08:00', task: 'Arrivée équipe technique', team: 'Technique', duration: 30, status: 'completed' },
      { time: '08:30', task: 'Montage son', team: 'Son', duration: 120, status: 'in-progress' },
      { time: '10:30', task: 'Montage lumière', team: 'Lumière', duration: 90, status: 'pending' },
      { time: '12:00', task: 'Pause déjeuner', team: 'Tous', duration: 60, status: 'pending' },
      { time: '13:00', task: 'Répétition générale', team: 'Artistes + Technique', duration: 180, status: 'pending' },
      { time: '16:00', task: 'Pause technique', team: 'Technique', duration: 30, status: 'pending' },
      { time: '16:30', task: 'Préparation spectacle', team: 'Tous', duration: 90, status: 'pending' },
      { time: '18:00', task: 'Ouverture portes', team: 'Accueil', duration: 60, status: 'pending' },
      { time: '20:00', task: 'Spectacle', team: 'Artistes + Technique', duration: 120, status: 'pending' },
      { time: '22:00', task: 'Démontage', team: 'Technique', duration: 120, status: 'pending' }
    ],
    team: {
      total: 12,
      sound: 2,
      lighting: 2,
      stage: 3,
      security: 2,
      catering: 2,
      artists: 1
    },
    equipment: {
      sound: 'Yamaha QL5 + 8 micros + 12 enceintes',
      lighting: 'GrandMA3 + 24 projecteurs + 8 mobiles',
      stage: 'Scène 12x8m + rideaux + éclairage'
    },
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    show: 'Spectacle de Danse Contemporaine',
    date: '2024-02-22',
    type: 'show',
    status: 'planning',
    timeline: [
      { time: '09:00', task: 'Arrivée équipe', team: 'Technique', duration: 30, status: 'pending' },
      { time: '09:30', task: 'Montage scène', team: 'Scène', duration: 150, status: 'pending' },
      { time: '12:00', task: 'Montage son', team: 'Son', duration: 90, status: 'pending' },
      { time: '13:30', task: 'Déjeuner', team: 'Tous', duration: 60, status: 'pending' },
      { time: '14:30', task: 'Montage lumière', team: 'Lumière', duration: 120, status: 'pending' },
      { time: '16:30', task: 'Répétition', team: 'Danseurs + Technique', duration: 120, status: 'pending' },
      { time: '18:30', task: 'Pause', team: 'Tous', duration: 30, status: 'pending' },
      { time: '19:00', task: 'Ouverture', team: 'Accueil', duration: 30, status: 'pending' },
      { time: '19:30', task: 'Spectacle', team: 'Danseurs + Technique', duration: 90, status: 'pending' },
      { time: '21:00', task: 'Démontage', team: 'Technique', duration: 90, status: 'pending' }
    ],
    team: {
      total: 10,
      sound: 1,
      lighting: 2,
      stage: 2,
      security: 1,
      catering: 2,
      artists: 2
    },
    equipment: {
      sound: 'Behringer X32 + 4 micros + 8 enceintes',
      lighting: 'Chamsys MagicQ + 16 projecteurs + 4 mobiles',
      stage: 'Scène 10x6m + sol de danse'
    },
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET - Récupérer tous les événements de planning
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const show = searchParams.get('show');
    const search = searchParams.get('search');

    let filteredEvents = planningEvents;

    // Filtrage par statut
    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }

    // Filtrage par spectacle
    if (show) {
      filteredEvents = filteredEvents.filter(event => 
        event.show.toLowerCase().includes(show.toLowerCase())
      );
    }

    // Recherche textuelle
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.show.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      planningEvents: filteredEvents,
      total: filteredEvents.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du planning:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel événement de planning
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      show,
      date,
      type = 'show',
      status = 'draft',
      timeline = [],
      team,
      equipment
    } = body;

    // Validation des données requises
    if (!show || !date || !team || !equipment) {
      return NextResponse.json(
        { error: 'Les champs spectacle, date, équipe et équipement sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouvel événement de planning
    const newPlanningEvent: PlanningEvent = {
      id: Date.now().toString(),
      show,
      date,
      type,
      status,
      timeline,
      team,
      equipment,
      organizationId: 'org-1', // Sera récupéré depuis la session
      createdById: session.user.id || 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    planningEvents.push(newPlanningEvent);

    return NextResponse.json(newPlanningEvent, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement de planning:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
