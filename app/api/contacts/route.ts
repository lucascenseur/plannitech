import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, type, company, role, status } = body;

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        type,
        company,
        role,
        status: status || 'active',
        lastContact: new Date()
      }
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du contact' },
      { status: 500 }
    );
  }
}