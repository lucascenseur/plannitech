import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Erreur lors de la récupération des membres d\'équipe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des membres d\'équipe' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, status, hourlyRate, isIntermittent, skills } = body;

    const member = await prisma.teamMember.create({
      data: {
        name,
        email,
        role,
        status: status || 'active',
        hourlyRate: hourlyRate || 0,
        isIntermittent: isIntermittent || false,
        skills: skills || [],
        totalHoursWorked: 0,
        totalEarnings: 0
      }
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du membre d\'équipe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du membre d\'équipe' },
      { status: 500 }
    );
  }
}