import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Types pour les fiches techniques
interface TechnicalSheet {
  id: string;
  title: string;
  show: string;
  venue: string;
  date: string;
  status: 'approved' | 'review' | 'draft' | 'rejected';
  sound: {
    microphones: number;
    speakers: number;
    mixer: string;
    monitors: number;
  };
  lighting: {
    spots: number;
    moving: number;
    dimmers: number;
    console: string;
  };
  stage: {
    width: number;
    depth: number;
    height: number;
    setup: string;
  };
  team: {
    sound: number;
    lighting: number;
    stage: number;
    security: number;
  };
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// Données d'exemple (sera remplacé par la base de données)
let technicalSheets: TechnicalSheet[] = [
  {
    id: '1',
    title: 'Concert Jazz - Fiche Technique',
    show: 'Concert Jazz au Théâtre Municipal',
    venue: 'Théâtre Municipal',
    date: '2024-02-15',
    status: 'approved',
    sound: {
      microphones: 8,
      speakers: 12,
      mixer: 'Yamaha QL5',
      monitors: 6
    },
    lighting: {
      spots: 24,
      moving: 8,
      dimmers: 48,
      console: 'GrandMA3'
    },
    stage: {
      width: 12,
      depth: 8,
      height: 6,
      setup: 'Concert standard'
    },
    team: {
      sound: 2,
      lighting: 2,
      stage: 3,
      security: 2
    },
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Spectacle Danse - Fiche Technique',
    show: 'Spectacle de Danse Contemporaine',
    venue: 'Centre Culturel',
    date: '2024-02-22',
    status: 'draft',
    sound: {
      microphones: 4,
      speakers: 8,
      mixer: 'Behringer X32',
      monitors: 4
    },
    lighting: {
      spots: 16,
      moving: 4,
      dimmers: 32,
      console: 'Chamsys MagicQ'
    },
    stage: {
      width: 10,
      depth: 6,
      height: 5,
      setup: 'Danse contemporaine'
    },
    team: {
      sound: 1,
      lighting: 2,
      stage: 2,
      security: 1
    },
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET - Récupérer toutes les fiches techniques
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const venue = searchParams.get('venue');
    const search = searchParams.get('search');

    let filteredSheets = technicalSheets;

    // Filtrage par statut
    if (status) {
      filteredSheets = filteredSheets.filter(sheet => sheet.status === status);
    }

    // Filtrage par lieu
    if (venue) {
      filteredSheets = filteredSheets.filter(sheet => 
        sheet.venue.toLowerCase().includes(venue.toLowerCase())
      );
    }

    // Recherche textuelle
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSheets = filteredSheets.filter(sheet => 
        sheet.title.toLowerCase().includes(searchLower) ||
        sheet.show.toLowerCase().includes(searchLower) ||
        sheet.venue.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      technicalSheets: filteredSheets,
      total: filteredSheets.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des fiches techniques:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle fiche technique
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      show,
      venue,
      date,
      status = 'draft',
      sound,
      lighting,
      stage,
      team
    } = body;

    // Validation des données requises
    if (!title || !show || !venue || !date || !sound || !lighting || !stage || !team) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Créer la nouvelle fiche technique
    const newTechnicalSheet: TechnicalSheet = {
      id: Date.now().toString(),
      title,
      show,
      venue,
      date,
      status,
      sound,
      lighting,
      stage,
      team,
      organizationId: 'org-1', // Sera récupéré depuis la session
      createdById: session.user.id || 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    technicalSheets.push(newTechnicalSheet);

    return NextResponse.json(newTechnicalSheet, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la fiche technique:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
