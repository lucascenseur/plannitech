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

// GET - Récupérer un spectacle spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const show = shows.find(s => s.id === id);

    if (!show) {
      return NextResponse.json(
        { error: 'Spectacle non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(show);
  } catch (error) {
    console.error('Erreur lors de la récupération du spectacle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un spectacle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const showIndex = shows.findIndex(s => s.id === id);
    
    if (showIndex === -1) {
      return NextResponse.json(
        { error: 'Spectacle non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le spectacle
    shows[showIndex] = {
      ...shows[showIndex],
      ...body,
      id, // Garder l'ID original
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(shows[showIndex]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du spectacle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un spectacle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const showIndex = shows.findIndex(s => s.id === id);
    
    if (showIndex === -1) {
      return NextResponse.json(
        { error: 'Spectacle non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le spectacle
    const deletedShow = shows.splice(showIndex, 1)[0];

    return NextResponse.json({
      message: 'Spectacle supprimé avec succès',
      show: deletedShow
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du spectacle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
