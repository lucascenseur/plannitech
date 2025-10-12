import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les bons de commande
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplierId');
    const search = searchParams.get('search');

    // Construire les filtres Prisma
    const where: any = {
      organizationId: session.user.organizationId || 'default-org'
    };

    if (status) {
      where.status = status;
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
        show: true,
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      purchaseOrders,
      total: purchaseOrders.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des bons de commande:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau bon de commande
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      number,
      supplierId,
      showId,
      description,
      totalAmount,
      status = 'draft',
      dueDate,
      items
    } = body;

    // Validation des données requises
    if (!number || !supplierId || !totalAmount) {
      return NextResponse.json(
        { error: 'Les champs numéro, fournisseur et montant total sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouveau bon de commande
    const newPurchaseOrder = await prisma.purchaseOrder.create({
      data: {
        number,
        supplierId,
        showId,
        description,
        totalAmount,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        items,
        organizationId: session.user.organizationId || 'default-org',
        createdById: session.user.id
      },
      include: {
        supplier: true,
        show: true,
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ purchaseOrder: newPurchaseOrder }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du bon de commande:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
