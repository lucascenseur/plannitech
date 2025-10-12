import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/contacts/[id] - Récupérer un contact par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const contact = await prisma.contact.findFirst({
      where: {
        id: id,
        organizationId: session.user.organizationId || 'default-org',
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }
      },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact non trouvé" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Erreur lors de la récupération du contact:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/[id] - Mettre à jour un contact
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, type, company, role, status } = body;

    // Vérifier que le contact existe et appartient à l'organisation
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: id,
        organizationId: session.user.organizationId || 'default-org',
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact non trouvé" }, { status: 404 });
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        type,
        company,
        role,
        status,
        lastContact: new Date()
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du contact:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id] - Supprimer un contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    // Vérifier que le contact existe et appartient à l'organisation
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: id,
        organizationId: session.user.organizationId || 'default-org',
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact non trouvé" }, { status: 404 });
    }

    // Supprimer le contact (les relations seront supprimées en cascade)
    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Contact supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

