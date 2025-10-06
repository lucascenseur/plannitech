import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { PlanLimitsManager } from "@/lib/plan-limits";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer l'organisation de l'utilisateur
    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    // Récupérer les contacts depuis la base de données
    const contacts = await prisma.contact.findMany({
      where: { organizationId: userOrgId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            projects: true,
            contracts: true,
            budgetItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ contacts });
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
    const { name, email, phone, type, description, website, isIntermittent } = body;
    
    // Récupérer l'organisation de l'utilisateur
    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    // Vérifier les limites du plan
    const limitsManager = new PlanLimitsManager(userOrgId);
    const canAddContact = await limitsManager.canAddContact();
    
    if (!canAddContact.allowed) {
      return NextResponse.json({ 
        message: canAddContact.reason,
        error: 'PLAN_LIMIT_EXCEEDED'
      }, { status: 403 });
    }

    // Créer le contact dans la base de données
    const newContact = await prisma.contact.create({
      data: {
        name,
        email: email || '',
        phone: phone || '',
        type: type || 'ARTIST',
        description: description || '',
        website: website || '',
        isIntermittent: isIntermittent || false,
        organizationId: userOrgId,
        createdById: session.user?.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            projects: true,
            contracts: true,
            budgetItems: true
          }
        }
      }
    });

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