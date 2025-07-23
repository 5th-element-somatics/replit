import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertPurchaseSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, email, hasReturnToBodyAddon } = req.body;
      
      if (!email || !amount) {
        return res.status(400).json({ message: "Email and amount are required" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          email,
          hasReturnToBodyAddon: hasReturnToBodyAddon ? 'true' : 'false'
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Webhook endpoint for Stripe payment confirmation
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      try {
        await storage.createPurchase({
          email: paymentIntent.metadata.email,
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          hasReturnToBodyAddon: paymentIntent.metadata.hasReturnToBodyAddon === 'true'
        });
      } catch (error) {
        console.error('Error storing purchase:', error);
      }
    }

    res.json({received: true});
  });

  // Verify purchase access for video
  app.get("/api/verify-purchase/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const purchase = await storage.getPurchaseByEmail(email);
      
      if (purchase) {
        res.json({ 
          hasAccess: true, 
          hasReturnToBodyAddon: purchase.hasReturnToBodyAddon 
        });
      } else {
        res.json({ hasAccess: false });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error verifying purchase: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
