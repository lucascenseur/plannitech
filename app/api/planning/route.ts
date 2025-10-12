import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const planningItems = await prisma.planningItem.findMany({
      include: {
        show: true,
        venue: true,
        assignedTeam: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return NextResponse.json({ planningItems });
  } catch (error) {
    console.error('Erreur lors de la récupération du planning:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du planning' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      type, 
      startTime, 
      endTime, 
      showId, 
      venueId, 
      assignedTeamIds,
      status 
    } = body;

    const planningItem = await prisma.planningItem.create({
      data: {
        title,
        description,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        showId,
        venueId,
        assignedTeamIds: assignedTeamIds || [],
        status: status || 'scheduled'
      }
    });

    return NextResponse.json({ planningItem }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'élément de planning:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'élément de planning' },
      { status: 500 }
    );
  }
}