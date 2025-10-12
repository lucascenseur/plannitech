import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const technicalSheets = await prisma.technicalSheet.findMany({
      include: {
        show: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ technicalSheets });
  } catch (error) {
    console.error('Erreur lors de la récupération des fiches techniques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des fiches techniques' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      showId, 
      type, 
      status, 
      requirements, 
      team, 
      notes 
    } = body;

    const technicalSheet = await prisma.technicalSheet.create({
      data: {
        title,
        showId,
        type,
        status: status || 'draft',
        requirements: requirements || {},
        team: team || {},
        notes: notes || ''
      }
    });

    return NextResponse.json({ technicalSheet }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la fiche technique:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la fiche technique' },
      { status: 500 }
    );
  }
}