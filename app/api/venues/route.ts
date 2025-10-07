import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Types pour les lieux
interface Venue {
  id: string;
  name: string;
  type: string;
  address: string;
  capacity: number;
  status: 'available' | 'maintenance' | 'booked' | 'unavailable';
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  facilities: string[];
  stage: {
    width: number;
    depth: number;
    height: number;
  };
  rates: {
    day: number;
    week: number;
  };
  rating: number;
  lastUsed?: string;
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// Données d'exemple (sera remplacé par la base de données)
let venues: Venue[] = [
  {
    id: '1',
    name: 'Théâtre Municipal',
    type: 'Théâtre',
    address: '15 Place de la République, 75001 Paris',
    capacity: 800,
    status: 'available',
    contact: {
      name: 'Marie Dubois',
      phone: '+33 1 42 36 78 90',
      email: 'contact@theatre-municipal.fr'
    },
    facilities: ['Parking', 'WiFi', 'Catering', 'Dressing rooms', 'Technical equipment'],
    stage: {
      width: 12,
      depth: 8,
      height: 6
    },
    rates: {
      day: 2500,
      week: 15000
    },
    rating: 4.8,
    lastUsed: '2024-01-15',
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Centre Culturel',
    type: 'Centre Culturel',
    address: '42 Avenue des Arts, 69000 Lyon',
    capacity: 500,
    status: 'available',
    contact: {
      name: 'Jean-Pierre Martin',
      phone: '+33 4 78 12 34 56',
      email: 'programmation@centre-culturel.fr'
    },
    facilities: ['Parking', 'WiFi', 'Catering', 'Dressing rooms', 'Recording studio'],
    stage: {
      width: 10,
      depth: 6,
      height: 5
    },
    rates: {
      day: 1800,
      week: 10000
    },
    rating: 4.6,
    lastUsed: '2024-01-20',
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Salle des Fêtes',
    type: 'Salle Polyvalente',
    address: '8 Rue de la Paix, 13000 Marseille',
    capacity: 300,
    status: 'maintenance',
    contact: {
      name: 'Sophie Laurent',
      phone: '+33 4 91 23 45 67',
      email: 'reservation@salle-fetes-marseille.fr'
    },
    facilities: ['Parking', 'WiFi', 'Catering', 'Dressing rooms'],
    stage: {
      width: 8,
      depth: 6,
      height: 4
    },
    rates: {
      day: 1200,
      week: 7000
    },
    rating: 4.2,
    lastUsed: '2024-01-10',
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET - Récupérer tous les lieux
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

    let filteredVenues = venues;

    // Filtrage par statut
    if (status) {
      filteredVenues = filteredVenues.filter(venue => venue.status === status);
    }

    // Filtrage par type
    if (type) {
      filteredVenues = filteredVenues.filter(venue => venue.type.toLowerCase() === type.toLowerCase());
    }

    // Recherche textuelle
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVenues = filteredVenues.filter(venue => 
        venue.name.toLowerCase().includes(searchLower) ||
        venue.address.toLowerCase().includes(searchLower) ||
        venue.contact.name.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      venues: filteredVenues,
      total: filteredVenues.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau lieu
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      type,
      address,
      capacity,
      status = 'available',
      contact,
      facilities = [],
      stage,
      rates,
      rating = 0
    } = body;

    // Validation des données requises
    if (!name || !type || !address || !contact || !stage || !rates) {
      return NextResponse.json(
        { error: 'Les champs nom, type, adresse, contact, scène et tarifs sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouveau lieu
    const newVenue: Venue = {
      id: Date.now().toString(),
      name,
      type,
      address,
      capacity: capacity || 0,
      status,
      contact,
      facilities,
      stage,
      rates,
      rating,
      organizationId: 'org-1', // Sera récupéré depuis la session
      createdById: session.user.id || 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    venues.push(newVenue);

    return NextResponse.json(newVenue, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du lieu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
