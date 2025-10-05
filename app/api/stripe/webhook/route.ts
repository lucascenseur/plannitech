import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature manquante" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Erreur de vérification de la signature webhook:", error);
    return NextResponse.json(
      { error: "Signature invalide" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { bookingId, eventId, userId } = paymentIntent.metadata;

        // Mettre à jour le statut de la réservation
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CONFIRMED" },
        });

        // Créer un enregistrement de paiement
        await prisma.payment.create({
          data: {
            invoiceId: bookingId, // Simplification pour l'exemple
            userId: userId,
            organizationId: "org-1", // À récupérer depuis la réservation
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: "COMPLETED",
            method: "CARD",
            metadata: {
              stripePaymentIntentId: paymentIntent.id,
            },
          },
        });

        console.log(`Paiement réussi pour la réservation ${bookingId}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { bookingId } = paymentIntent.metadata;

        // Mettre à jour le statut de la réservation
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
        });

        console.log(`Paiement échoué pour la réservation ${bookingId}`);
        break;
      }

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

