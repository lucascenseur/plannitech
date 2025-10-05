import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { organizationName, organizationType, industry, teamSize, goals } = await request.json();

    // Validation
    if (!organizationName || !industry || !goals || goals.length === 0) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Mettre à jour l'organisation de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organizations: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user?.organizations?.[0]) {
      return NextResponse.json(
        { error: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    const organizationId = user.organizations[0].organizationId;

    // Mettre à jour l'organisation
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        name: organizationName,
        // Ajouter d'autres champs selon les besoins
      },
    });

    // Mettre à jour le profil utilisateur avec les préférences
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        metadata: {
          onboardingCompleted: true,
          organizationType,
          industry,
          teamSize,
          goals,
        },
      },
    });

    return NextResponse.json({
      message: "Configuration terminée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la configuration:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
