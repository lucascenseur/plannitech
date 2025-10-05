import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const organizationId = session.user.organizations?.[0]?.id;
    
    if (!organizationId) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // Récupérer les statistiques de facturation
    const [
      totalRevenue,
      monthlyRecurringRevenue,
      annualRecurringRevenue,
      activeSubscriptions,
      canceledSubscriptions,
      trialSubscriptions,
      churnRate,
      averageRevenuePerUser,
      byPlan,
      monthlyTrend
    ] = await Promise.all([
      // Total revenue
      prisma.invoice.aggregate({
        where: {
          organizationId,
          status: 'paid',
        },
        _sum: {
          total: true,
        },
      }),
      
      // Monthly recurring revenue
      prisma.subscription.aggregate({
        where: {
          organizationId,
          status: 'active',
        },
        _sum: {
          plan: {
            price: true,
          },
        },
      }),
      
      // Annual recurring revenue
      prisma.subscription.aggregate({
        where: {
          organizationId,
          status: 'active',
        },
        _sum: {
          plan: {
            price: true,
          },
        },
      }),
      
      // Active subscriptions
      prisma.subscription.count({
        where: {
          organizationId,
          status: 'active',
        },
      }),
      
      // Canceled subscriptions
      prisma.subscription.count({
        where: {
          organizationId,
          status: 'canceled',
        },
      }),
      
      // Trial subscriptions
      prisma.subscription.count({
        where: {
          organizationId,
          status: 'trialing',
        },
      }),
      
      // Churn rate (simplified calculation)
      prisma.subscription.count({
        where: {
          organizationId,
          status: 'canceled',
        },
      }),
      
      // Average revenue per user
      prisma.invoice.aggregate({
        where: {
          organizationId,
          status: 'paid',
        },
        _avg: {
          total: true,
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
        _sum: {
          plan: {
            price: true,
          },
        },
      }),
      
      // Monthly trend (last 12 months)
      prisma.invoice.groupBy({
        by: ['createdAt'],
        where: {
          organizationId,
          status: 'paid',
          createdAt: {
            gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
          },
        },
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },
      })
    ]);

    // Calculer le taux de churn
    const totalSubscriptions = activeSubscriptions + canceledSubscriptions;
    const churnRateValue = totalSubscriptions > 0 ? (canceledSubscriptions / totalSubscriptions) * 100 : 0;

    // Calculer l'ARPU
    const arpuValue = averageRevenuePerUser._avg.total || 0;

    // Formater les données par plan
    const byPlanFormatted = await Promise.all(
      byPlan.map(async (plan) => {
        const planDetails = await prisma.subscriptionPlan.findUnique({
          where: { id: plan.planId },
        });
        
        return {
          planId: plan.planId,
          planName: planDetails?.name || 'Unknown',
          count: plan._count.id,
          revenue: plan._sum.plan?.price || 0,
        };
      })
    );

    // Formater les données de tendance mensuelle
    const monthlyTrendFormatted = monthlyTrend.map((trend) => ({
      month: new Date(trend.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      revenue: trend._sum.total || 0,
      subscriptions: trend._count.id,
      churn: 0, // À calculer selon vos besoins
    }));

    const stats = {
      totalRevenue: totalRevenue._sum.total || 0,
      monthlyRecurringRevenue: monthlyRecurringRevenue._sum.plan?.price || 0,
      annualRecurringRevenue: annualRecurringRevenue._sum.plan?.price || 0,
      activeSubscriptions,
      canceledSubscriptions,
      trialSubscriptions,
      churnRate: churnRateValue,
      averageRevenuePerUser: arpuValue,
      byPlan: byPlanFormatted,
      monthlyTrend: monthlyTrendFormatted,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching billing stats:', error);
    return NextResponse.json({ message: 'Failed to fetch billing stats' }, { status: 500 });
  }
}

