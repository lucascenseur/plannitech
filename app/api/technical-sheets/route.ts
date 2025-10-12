import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: any = {
      organizationId: session.user.organizationId || 'default-org'
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const technicalSheets = await prisma.technicalSheet.findMany({
      where,
      include: {
        project: true,
        createdBy: {
          select: { name: true, email: true }
        }
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      projectId, 
      type, 
      status, 
      requirements, 
      team, 
      notes 
    } = body;

    // Validation des données requises
    if (!title || !projectId || !type) {
      return NextResponse.json(
        { error: 'Les champs titre, projet et type sont requis' },
        { status: 400 }
      );
    }

    const technicalSheet = await prisma.technicalSheet.create({
      data: {
        title,
        projectId,
        type,
        status: status || 'DRAFT',
        requirements: requirements || {},
        team: team || {},
        notes: notes || '',
        organizationId: session.user.organizationId || 'default-org',
        createdById: session.user.id
      },
      include: {
        project: true,
        createdBy: {
          select: { name: true, email: true }
        }
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