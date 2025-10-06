import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { PlanningExportOptions, PlanningPDFData } from "@/types/team";

const prisma = new PrismaClient();

// Générer un planning PDF
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    const body = await request.json();
    const { 
      startDate, 
      endDate, 
      format = 'PDF',
      includeMembers = true,
      includeProviders = true,
      includeCosts = true,
      includeRequirements = false,
      includeNotes = false,
      template = 'DEFAULT',
      language = 'fr'
    }: PlanningExportOptions = body;

    // Récupérer l'organisation
    const organization = await prisma.organization.findUnique({
      where: { id: userOrgId }
    });

    if (!organization) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 404 });
    }

    // Récupérer les tâches dans la période
    const tasks = await prisma.task.findMany({
      where: {
        organizationId: userOrgId,
        startDate: {
          gte: new Date(startDate)
        },
        endDate: {
          lte: new Date(endDate)
        }
      },
      include: {
        assignedMembers: {
          include: {
            contact: {
              select: { id: true, name: true, email: true, type: true }
            }
          }
        },
        assignedProviders: {
          include: {
            contact: {
              select: { id: true, name: true, email: true, type: true }
            }
          }
        },
        venue: {
          select: { id: true, name: true, address: true }
        },
        project: {
          select: { id: true, title: true }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    // Calculer les statistiques
    const totalTasks = tasks.length;
    const totalHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    const totalCost = tasks.reduce((sum, task) => {
      let cost = 0;
      
      // Calculer le coût des membres
      task.assignedMembers.forEach(assignment => {
        const member = assignment.contact;
        const hourlyRate = (member as any).hourlyRate || 0;
        const hours = task.estimatedHours || 0;
        cost += hours * hourlyRate;
      });
      
      // Calculer le coût des prestataires
      task.assignedProviders.forEach(assignment => {
        const provider = assignment.contact;
        const hourlyRate = (provider as any).hourlyRate || 0;
        const hours = task.estimatedHours || 0;
        cost += hours * hourlyRate;
      });
      
      return sum + cost;
    }, 0);

    // Extraire les membres et lieux uniques
    const members = [...new Set(tasks.flatMap(task => 
      task.assignedMembers.map(a => a.contact.name)
    ))];
    const venues = [...new Set(tasks.map(task => task.venue?.name).filter(Boolean))];

    // Préparer les données pour le PDF
    const planningData: PlanningPDFData = {
      organization: {
        name: organization.name,
        address: organization.address || '',
        logo: organization.logo || undefined
      },
      period: {
        start: new Date(startDate),
        end: new Date(endDate),
        type: getPeriodType(startDate, endDate)
      },
      tasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        type: task.type,
        priority: task.priority,
        status: task.status,
        startDate: task.startDate,
        endDate: task.endDate,
        startTime: formatTime(task.startDate),
        endTime: formatTime(task.endDate),
        duration: task.estimatedHours || 0,
        assignedMembers: task.assignedMembers.map(a => a.contact.name),
        assignedProviders: task.assignedProviders.map(a => a.contact.name),
        venue: task.venue?.name || '',
        project: task.project?.title || '',
        requirements: (task.metadata as any)?.requirements || [],
        notes: (task.metadata as any)?.notes || '',
        totalCost: 0 // Calculé ci-dessus
      })),
      summary: {
        totalTasks,
        totalHours,
        totalCost,
        members,
        venues
      },
      generatedAt: new Date()
    };

    // Générer le PDF selon le format demandé
    if (format === 'PDF') {
      const pdfBuffer = await generatePlanningPDF(planningData, {
        includeMembers,
        includeProviders,
        includeCosts,
        includeRequirements,
        includeNotes,
        template,
        language
      });

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="planning-${formatDate(startDate)}-${formatDate(endDate)}.pdf"`
        }
      });
    } else if (format === 'CSV') {
      const csvContent = generatePlanningCSV(planningData, {
        includeMembers,
        includeProviders,
        includeCosts,
        includeRequirements,
        includeNotes,
        language
      });

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="planning-${formatDate(startDate)}-${formatDate(endDate)}.csv"`
        }
      });
    } else {
      return NextResponse.json({ message: 'Format non supporté' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur lors de la génération du planning:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Fonctions utilitaires
function getPeriodType(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Jour';
  if (diffDays <= 7) return 'Semaine';
  if (diffDays <= 31) return 'Mois';
  return 'Période personnalisée';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function formatDate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

// Générer le PDF (simulation - en production, utiliser une vraie librairie PDF)
async function generatePlanningPDF(
  data: PlanningPDFData, 
  options: any
): Promise<Buffer> {
  // En production, utiliser une librairie comme puppeteer, jsPDF, ou PDFKit
  // Pour l'instant, on retourne un PDF simple
  
  const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(Planning ${data.organization.name}) Tj
0 -20 Td
(Période: ${data.period.start.toLocaleDateString()} - ${data.period.end.toLocaleDateString()}) Tj
0 -20 Td
(Total: ${data.summary.totalTasks} tâches, ${data.summary.totalHours}h, €${data.summary.totalCost}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
454
%%EOF
`;

  return Buffer.from(pdfContent);
}

// Générer le CSV
function generatePlanningCSV(
  data: PlanningPDFData, 
  options: any
): string {
  const headers = [
    'Titre',
    'Type',
    'Priorité',
    'Statut',
    'Date de début',
    'Heure de début',
    'Date de fin',
    'Heure de fin',
    'Durée (h)',
    'Lieu',
    'Projet'
  ];

  if (options.includeMembers) {
    headers.push('Membres assignés');
  }
  if (options.includeProviders) {
    headers.push('Prestataires assignés');
  }
  if (options.includeCosts) {
    headers.push('Coût (€)');
  }
  if (options.includeRequirements) {
    headers.push('Exigences');
  }
  if (options.includeNotes) {
    headers.push('Notes');
  }

  const rows = data.tasks.map(task => {
    const row = [
      task.title,
      task.type,
      task.priority,
      task.status,
      task.startDate.toLocaleDateString(),
      task.startTime,
      task.endDate.toLocaleDateString(),
      task.endTime,
      task.duration.toString(),
      task.venue,
      task.project
    ];

    if (options.includeMembers) {
      row.push(task.assignedMembers.join(', '));
    }
    if (options.includeProviders) {
      row.push(task.assignedProviders.join(', '));
    }
    if (options.includeCosts) {
      row.push(task.totalCost.toString());
    }
    if (options.includeRequirements) {
      row.push(task.requirements.join(', '));
    }
    if (options.includeNotes) {
      row.push(task.notes);
    }

    return row;
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}
