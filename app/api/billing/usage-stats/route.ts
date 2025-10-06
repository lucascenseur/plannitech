import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const organizationId = session.user.organizations?.[0]?.id;
    
    if (!organizationId) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // Récupérer les statistiques d'utilisation
    const [
      totalProjects,
      totalUsers,
      totalStorage,
      totalApiCalls,
      byPlan,
      monthlyTrend
    ] = await Promise.all([
      // Total projects
      prisma.project.count({
        where: {
          organizationId,
        },
      }),
      
      // Total users
      prisma.user.count({
        where: {
          organizations: {
            some: {
              id: organizationId,
            },
          },
        },
      }),
      
      // Total storage (simplified calculation)
      prisma.document.aggregate({
        where: {
          organizationId,
        },
        _sum: {
          size: true,
        },
      }),
      
      // Total API calls (simplified calculation)
      prisma.auditLog.count({
        where: {
          organizationId,
          action: 'API_CALL',
        },
      }),
      
      // By plan
      prisma.subscription.groupBy({
        by: ['planId'],
        where: {
          organizationId,
        },
        _count: {
          id: true,
        },
      }),
      
      // Monthly trend (last 12 months)
      prisma.auditLog.groupBy({
        by: ['createdAt'],
        where: {
          organizationId,
          createdAt: {
            gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
          },
        },
        _count: {
          id: true,
        },
      })
    ]);

    // Formater les données par plan
    const byPlanFormatted = await Promise.all(
      byPlan.map(async (plan) => {
        const planDetails = await prisma.subscriptionPlan.findUnique({
          where: { id: plan.planId },
        });
        
        return {
          planId: plan.planId,
          planName: planDetails?.name || 'Unknown',
          projects: 0, // À calculer selon vos besoins
          users: 0, // À calculer selon vos besoins
          storage: 0, // À calculer selon vos besoins
          apiCalls: 0, // À calculer selon vos besoins
        };
      })
    );

    // Formater les données de tendance mensuelle
    const monthlyTrendFormatted = monthlyTrend.map((trend) => ({
      month: new Date(trend.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      projects: 0, // À calculer selon vos besoins
      users: 0, // À calculer selon vos besoins
      storage: 0, // À calculer selon vos besoins
      apiCalls: trend._count.id,
    }));

    const stats = {
      totalProjects,
      totalUsers,
      totalStorage: totalStorage._sum.size || 0,
      totalApiCalls,
      byPlan: byPlanFormatted,
      monthlyTrend: monthlyTrendFormatted,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json({ message: 'Failed to fetch usage stats' }, { status: 500 });
  }
}

