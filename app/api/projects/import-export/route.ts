import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectCSVRow, ImportResult } from "@/types/project";
import { projectSchema } from "@/types/project";

// POST /api/projects/import-export/import - Importer des projets depuis CSV
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { data }: { data: ProjectCSVRow[] } = body;

    const result: ImportResult = {
      success: 0,
      errors: [],
      warnings: [],
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Conversion des données CSV en format attendu
        const projectData = {
          name: row.name,
          description: row.description || "",
          type: row.type as any,
          status: row.status as any,
          startDate: row.startDate,
          endDate: row.endDate || undefined,
          venue: row.venue || undefined,
          budget: row.budget ? parseFloat(row.budget) : undefined,
          teamSize: row.teamSize ? parseInt(row.teamSize) : undefined,
          isPublic: row.isPublic === "true",
          tags: row.tags ? row.tags.split(",").map(t => t.trim()) : [],
        };

        // Validation avec Zod
        const validatedData = projectSchema.parse(projectData);

        // Création du projet
        await prisma.project.create({
          data: {
            ...validatedData,
            organizationId: session.user.organizations[0]?.organizationId,
            createdById: session.user.id,
          },
        });

        result.success++;
      } catch (error) {
        result.errors.push({
          row: i + 1,
          errors: [error instanceof Error ? error.message : "Erreur inconnue"],
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de l'import:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// GET /api/projects/import-export/export - Exporter des projets vers CSV
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectIds = searchParams.get("projectIds")?.split(",") || [];

    let where: any = {
      organizationId: session.user.organizations[0]?.organizationId,
    };

    if (projectIds.length > 0) {
      where.id = { in: projectIds };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Conversion en format CSV
    const csvData = projects.map(project => ({
      name: project.name,
      description: project.description || "",
      type: project.type,
      status: project.status,
      startDate: project.startDate.toISOString().split('T')[0],
      endDate: project.endDate ? project.endDate.toISOString().split('T')[0] : "",
      venue: project.venue || "",
      budget: project.budget?.toString() || "",
      teamSize: project.teamSize?.toString() || "",
      isPublic: project.isPublic.toString(),
      tags: project.tags?.join(",") || "",
      createdAt: project.createdAt.toISOString().split('T')[0],
      createdBy: project.createdBy.name,
    }));

    // Génération du CSV
    const headers = [
      "name", "description", "type", "status", "startDate", "endDate",
      "venue", "budget", "teamSize", "isPublic", "tags", "createdAt", "createdBy"
    ];

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row] || "";
          // Échapper les virgules et guillemets dans les valeurs
          return typeof value === "string" && (value.includes(",") || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(",")
      )
    ].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="projets-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'export:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

