import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bulkActionSchema = z.object({
  action: z.enum(["DELETE", "ARCHIVE", "UPDATE_STATUS", "UPDATE_TYPE"]),
  projectIds: z.array(z.string()),
  data: z.any().optional(),
});

// POST /api/projects/bulk - Actions en lot sur les projets
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { action, projectIds, data } = bulkActionSchema.parse(body);

    // Vérifier que tous les projets appartiennent à l'organisation
    const projects = await prisma.project.findMany({
      where: {
        id: { in: projectIds },
        organizationId: session.user.organizations[0]?.organizationId,
      },
    });

    if (projects.length !== projectIds.length) {
      return NextResponse.json(
        { error: "Certains projets n'existent pas ou ne vous appartiennent pas" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "DELETE":
        result = await prisma.project.deleteMany({
          where: {
            id: { in: projectIds },
            organizationId: session.user.organizations[0]?.organizationId,
          },
        });
        break;

      case "ARCHIVE":
        result = await prisma.project.updateMany({
          where: {
            id: { in: projectIds },
            organizationId: session.user.organizations[0]?.organizationId,
          },
          data: {
            status: "ARCHIVED",
          },
        });
        break;

      case "UPDATE_STATUS":
        if (!data?.status) {
          return NextResponse.json(
            { error: "Le nouveau statut est requis" },
            { status: 400 }
          );
        }
        result = await prisma.project.updateMany({
          where: {
            id: { in: projectIds },
            organizationId: session.user.organizations[0]?.organizationId,
          },
          data: {
            status: data.status,
          },
        });
        break;

      case "UPDATE_TYPE":
        if (!data?.type) {
          return NextResponse.json(
            { error: "Le nouveau type est requis" },
            { status: 400 }
          );
        }
        result = await prisma.project.updateMany({
          where: {
            id: { in: projectIds },
            organizationId: session.user.organizations[0]?.organizationId,
          },
          data: {
            type: data.type,
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: "Action non supportée" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `Action ${action} effectuée avec succès`,
      affectedCount: result.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de l'action en lot:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

