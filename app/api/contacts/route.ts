import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Stockage temporaire en mémoire
let contacts: any[] = [];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Filtrer les contacts par organisation de l'utilisateur
    const userOrgId = session.user?.organizations?.[0]?.organizationId || '1';
    const userContacts = contacts.filter(contact => contact.organizationId === userOrgId);

    return NextResponse.json({ contacts: userContacts });
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
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
    
    const newContact = {
      id: (contacts.length + 1).toString(),
      name: body.name,
      email: body.email || '',
      phone: body.phone || '',
      type: body.type || 'ARTIST',
      status: body.status || 'ACTIVE',
      description: body.description || '',
      website: body.website || '',
      isIntermittent: body.isIntermittent || false,
      isFavorite: body.isFavorite || false,
      organizationId: session.user?.organizations?.[0]?.organizationId || '1',
      createdById: session.user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    contacts.push(newContact);

    return NextResponse.json({ 
      message: 'Contact créé avec succès',
      contact: newContact 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du contact:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}