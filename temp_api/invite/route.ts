import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { email, role } = await request.json();

    // Validation
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email et rôle sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur a les permissions pour inviter
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

    const userRole = user.organizations[0].role;
    if (!["OWNER", "ADMIN"].includes(userRole)) {
      return NextResponse.json(
        { error: "Permissions insuffisantes" },
        { status: 403 }
      );
    }

    const organizationId = user.organizations[0].organizationId;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Vérifier si l'utilisateur est déjà dans l'organisation
      const existingMembership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: existingUser.id,
          },
        },
      });

      if (existingMembership) {
        return NextResponse.json(
          { error: "Cet utilisateur fait déjà partie de l'organisation" },
          { status: 400 }
        );
      }

      // Ajouter l'utilisateur existant à l'organisation
      await prisma.organizationUser.create({
        data: {
          organizationId,
          userId: existingUser.id,
          role: role as UserRole,
        },
      });

      return NextResponse.json({
        message: "Utilisateur ajouté à l'organisation",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        },
      });
    } else {
      // Créer un utilisateur invité
      const invitedUser = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0], // Nom par défaut
          emailVerified: null, // Pas encore vérifié
        },
      });

      // Ajouter à l'organisation
      await prisma.organizationUser.create({
        data: {
          organizationId,
          userId: invitedUser.id,
          role: role as UserRole,
        },
      });

      // TODO: Envoyer un email d'invitation
      // await sendInvitationEmail(email, organization.name);

      return NextResponse.json({
        message: "Invitation envoyée",
        user: {
          id: invitedUser.id,
          email: invitedUser.email,
        },
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'invitation:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
