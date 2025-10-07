import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Types pour les spectacles
interface Show {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  status: 'confirmed' | 'planning' | 'draft' | 'cancelled';
  artists: string[];
  team: number;
  budget: number;
  description?: string;
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// Données d'exemple (sera remplacé par la base de données)
let shows: Show[] = [
  {
    id: '1',
    title: 'Concert Jazz au Théâtre Municipal',
    type: 'Concert',
    date: '2024-02-15',
    time: '20:00',
    venue: 'Théâtre Municipal',
    status: 'confirmed',
    artists: ['Quartet Jazz Moderne', 'Sarah Johnson'],
    team: 8,
    budget: 15000,
    description: 'Concert de jazz moderne avec un quartet exceptionnel',
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Spectacle de Danse Contemporaine',
    type: 'Danse',
    date: '2024-02-22',
    time: '19:30',
    venue: 'Centre Culturel',
    status: 'planning',
    artists: ['Compagnie Danse Libre', 'Marie Dubois'],
    team: 12,
    budget: 22000,
    description: 'Spectacle de danse contemporaine innovant',
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Pièce de Théâtre - Hamlet',
    type: 'Théâtre',
    date: '2024-03-01',
    time: '20:30',
    venue: 'Salle des Fêtes',
    status: 'confirmed',
    artists: ['Troupe Théâtrale Moderne', 'Jean-Pierre Martin'],
    team: 15,
    budget: 18000,
    description: 'Adaptation moderne de la célèbre pièce de Shakespeare',
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET - Récupérer tous les spectacles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let filteredShows = shows;

    // Filtrage par statut
    if (status) {
      filteredShows = filteredShows.filter(show => show.status === status);
    }

    // Filtrage par type
    if (type) {
      filteredShows = filteredShows.filter(show => show.type.toLowerCase() === type.toLowerCase());
    }

    // Recherche textuelle
    if (search) {
      const searchLower = search.toLowerCase();
      filteredShows = filteredShows.filter(show => 
        show.title.toLowerCase().includes(searchLower) ||
        show.artists.some(artist => artist.toLowerCase().includes(searchLower)) ||
        show.venue.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      shows: filteredShows,
      total: filteredShows.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des spectacles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau spectacle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      type,
      date,
      time,
      venue,
      status = 'draft',
      artists = [],
      team = 0,
      budget = 0,
      description
    } = body;

    // Validation des données requises
    if (!title || !type || !date || !time || !venue) {
      return NextResponse.json(
        { error: 'Les champs titre, type, date, heure et lieu sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouveau spectacle
    const newShow: Show = {
      id: Date.now().toString(),
      title,
      type,
      date,
      time,
      venue,
      status,
      artists,
      team,
      budget,
      description,
      organizationId: 'org-1', // Sera récupéré depuis la session
      createdById: session.user.id || 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    shows.push(newShow);

    return NextResponse.json(newShow, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du spectacle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
