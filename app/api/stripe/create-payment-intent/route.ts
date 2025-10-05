import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, currency = "EUR" } = await request.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: "bookingId et amount sont requis" },
        { status: 400 }
      );
    }

    // Récupérer les détails de la réservation
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
        user: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Créer le PaymentIntent avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en centimes
      currency: currency.toLowerCase(),
      metadata: {
        bookingId: booking.id,
        eventId: booking.event.id,
        userId: booking.user.id,
      },
      description: `Paiement pour ${booking.event.title}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Erreur lors de la création du PaymentIntent:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

