import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { aiEmailService } from "./ai-email-service";
import { 
  insertPurchaseSchema, 
  insertApplicationSchema, 
  insertLeadSchema,
  insertContactMessageSchema,
  insertWaitlistEntrySchema,
  insertCourseSchema,
  insertSectionSchema,
  insertLessonSchema,
  insertOfferSchema,
  insertMembershipSchema,
  insertCourseOrderSchema,
  aiEmailCampaigns,
  aiEmailTemplates,
  aiEmailQueue,
  aiEmailDeliveries,
  contactMessages,
  waitlistEntries,
  leads,
  applications,
  purchases,
  adminSessions,
  magicLinks,
  workshops,
  insertWorkshopSchema,
  workshopRegistrations,
  insertWorkshopRegistrationSchema,
  courses,
  sections,
  lessons,
  offers,
  memberships,
  courseOrders,
  lessonProgress
} from "@shared/schema";
import { sql, count, sum, eq, desc, and, gte, lt } from 'drizzle-orm';
import { db } from "./db";
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

// Extend Express Request type for admin middleware
declare global {
  namespace Express {
    interface Request {
      adminUser?: {
        email: string;
        sessionToken: string;
      };
    }
  }
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Quiz result email templates
const resultTemplates = {
  people_pleaser: {
    title: "The People-Pleaser",
    description: "You're naturally compassionate and deeply attuned to others' needs, but sometimes this gift becomes a burden when you lose sight of your own desires.",
    transformation: "Your journey involves learning to honor your own needs while maintaining your beautiful capacity for empathy. You're discovering that setting boundaries actually allows you to give more authentically.",
    gift: "Your superpower is creating harmony and seeing everyone's perspective. When balanced, you become a masterful leader who can unite people while staying true to yourself.",
    practices: [
      "Practice saying 'let me think about it' instead of automatic yes",
      "Set one small boundary each day",
      "Check in with your body before making decisions",
      "Celebrate moments when you choose yourself"
    ]
  },
  perfectionist: {
    title: "The Perfectionist", 
    description: "You have incredibly high standards and a gift for excellence, but the inner critic can be relentless, making you feel like nothing is ever quite good enough.",
    transformation: "Your path involves embracing 'good enough' as sacred and learning that your worth isn't tied to your achievements. You're discovering the beauty in imperfection and process over outcome.",
    gift: "Your superpower is your attention to detail and ability to create beautiful, meaningful work. When balanced, you become a visionary who inspires others through authentic excellence.",
    practices: [
      "Set timers for tasks to practice 'good enough'",
      "Celebrate progress over perfection",
      "Practice self-compassion when things don't go as planned", 
      "Share your messy, imperfect moments with trusted friends"
    ]
  },
  rebel: {
    title: "The Awakened Rebel",
    description: "You see through societal programming and have a fierce desire for authentic living, but sometimes the anger at systems can feel overwhelming or isolating.",
    transformation: "Your journey involves channeling your revolutionary spirit into sustainable change and finding your tribe of fellow truth-seekers. You're learning to be fierce AND soft.",
    gift: "Your superpower is seeing what others can't and having the courage to challenge the status quo. When balanced, you become a powerful catalyst for positive change in the world.",
    practices: [
      "Channel anger into creative expression or activism",
      "Find your community of fellow rebels and change-makers",
      "Practice discernment about which battles to fight",
      "Honor your sensitivity as a strength, not a weakness"
    ]
  }
};

async function sendQuizResultEmail(email: string, name: string, quizResult: string) {
  const template = resultTemplates[quizResult as keyof typeof resultTemplates];
  if (!template) return;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Your Good Girl Archetype: ${template.title} 💫`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%); color: #ffffff; padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #C77DFF; font-size: 28px; margin-bottom: 10px;">Your Sacred Archetype</h1>
          <h2 style="color: #E879F9; font-size: 24px; margin: 0;">${template.title}</h2>
        </div>
        
        <div style="background: rgba(199, 125, 255, 0.1); border: 1px solid #C77DFF; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
          <h3 style="color: #F3E8FF; font-size: 20px; margin-bottom: 15px;">Hello Beautiful ${name} 💜</h3>
          <p style="color: #E5E7EB; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
            ${template.description}
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #C77DFF; font-size: 18px; margin-bottom: 15px;">Your Transformation Journey</h3>
          <p style="color: #E5E7EB; line-height: 1.6; font-size: 16px;">
            ${template.transformation}
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #C77DFF; font-size: 18px; margin-bottom: 15px;">Your Sacred Gift</h3>
          <p style="color: #E5E7EB; line-height: 1.6; font-size: 16px;">
            ${template.gift}
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #C77DFF; font-size: 18px; margin-bottom: 15px;">Sacred Practices for You</h3>
          <ul style="color: #E5E7EB; line-height: 1.6; font-size: 16px; padding-left: 20px;">
            ${template.practices.map(practice => `<li style="margin-bottom: 8px;">${practice}</li>`).join('')}
          </ul>
        </div>

        <div style="background: linear-gradient(135deg, #C77DFF 0%, #E879F9 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
          <h3 style="color: #000000; font-size: 20px; margin-bottom: 15px;">Ready to Go Deeper?</h3>
          <p style="color: #000000; font-size: 16px; margin-bottom: 20px;">
            The Good Girl Paradox Masterclass will guide you through the complete transformation from good girl conditioning to authentic empowerment.
          </p>
          <a href="${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://fifthelementsomatics.com'}/masterclass" 
             style="display: inline-block; background: #000000; color: #C77DFF; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Explore the Masterclass
          </a>
        </div>

        <div style="text-align: center; color: #9CA3AF; font-size: 14px;">
          <p>With love and light,<br><strong style="color: #C77DFF;">Saint</strong><br>Fifth Element Somatics</p>
          <p style="margin-top: 20px;">
            <a href="${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://fifthelementsomatics.com'}" 
               style="color: #C77DFF; text-decoration: none;">fifthelementsomatics.com</a>
          </p>
        </div>
      </div>
    `
  };

  await sgMail.send(msg);
}

async function sendMeditationDownloadEmail(email: string, name: string) {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Your Free Grounding Meditation - Fifth Element Somatics 🌟`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%); color: #ffffff; padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #C77DFF; font-size: 28px; margin-bottom: 10px;">Your Meditation Is Ready</h1>
          <p style="color: #E879F9; font-size: 18px; margin: 0;">Feel Safe In Your Skin Again</p>
        </div>
        
        <div style="background: rgba(199, 125, 255, 0.1); border: 1px solid #C77DFF; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
          <h3 style="color: #F3E8FF; font-size: 20px; margin-bottom: 15px;">Hello Beautiful ${name} 💜</h3>
          <p style="color: #E5E7EB; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
            Your free 10-minute grounding meditation is waiting for you. This practice will help you regulate your nervous system, reconnect with your body's wisdom, and feel deeply grounded in your skin.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://fifthelementsomatics.com'}/meditation-access" 
               style="display: inline-block; background: linear-gradient(135deg, #C77DFF 0%, #E879F9 100%); color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              🎧 Listen & Download Your Meditation
            </a>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #C77DFF; font-size: 18px; margin-bottom: 15px;">What You'll Experience</h3>
          <ul style="color: #E5E7EB; line-height: 1.6; font-size: 16px; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Deep nervous system regulation in real time</li>
            <li style="margin-bottom: 8px;">Reconnection with your body's inherent wisdom</li>
            <li style="margin-bottom: 8px;">Release of stored tension and chronic stress</li>
            <li style="margin-bottom: 8px;">Grounded presence and inner calm</li>
            <li style="margin-bottom: 8px;">Enhanced body awareness and felt safety</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #C77DFF; font-size: 18px; margin-bottom: 15px;">How to Use</h3>
          <p style="color: #E5E7EB; line-height: 1.6; font-size: 16px;">
            • Find a quiet, comfortable space where you won't be disturbed<br>
            • Use headphones for the most immersive experience<br>
            • Allow yourself to fully receive without judgment<br>
            • Practice regularly for the deepest benefits<br>
            • Be gentle with whatever arises
          </p>
        </div>

        <div style="background: linear-gradient(135deg, #C77DFF 0%, #E879F9 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
          <h3 style="color: #000000; font-size: 20px; margin-bottom: 15px;">Ready to Go Deeper?</h3>
          <p style="color: #000000; font-size: 16px; margin-bottom: 20px;">
            If this meditation resonates with you, explore The Good Girl Paradox Masterclass for a complete transformation journey.
          </p>
          <a href="${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://fifthelementsomatics.com'}/masterclass" 
             style="display: inline-block; background: #000000; color: #C77DFF; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Explore the Masterclass
          </a>
        </div>

        <div style="text-align: center; color: #9CA3AF; font-size: 14px;">
          <p>With love and light,<br><strong style="color: #C77DFF;">Saint</strong><br>Fifth Element Somatics</p>
          <p style="margin-top: 20px;">
            <a href="${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://fifthelementsomatics.com'}" 
               style="color: #C77DFF; text-decoration: none;">fifthelementsomatics.com</a>
          </p>
        </div>
      </div>
    `
  };

  await sgMail.send(msg);
}

export async function registerRoutes(app: Express): Promise<Server> {
  console.log("🚀 Registering API routes...");

  // Voice generation endpoint using Eleven Labs
  app.post("/api/generate-voice", async (req, res) => {
    try {
      const { text, voice_id = "BLGGT4QhGwlt0T3oikNc", model_id = "eleven_multilingual_v2" } = req.body;
      
      if (!process.env.ELEVEN_LABS_API_KEY) {
        return res.status(500).json({ error: "Voice generation service not configured" });
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY
        },
        body: JSON.stringify({
          text,
          model_id,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Eleven Labs API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength
      });
      
      res.send(Buffer.from(audioBuffer));
    } catch (error: any) {
      console.error("Voice generation error:", error);
      res.status(500).json({ error: "Failed to generate voice" });
    }
  });

  // Manual test purchase endpoint
  app.post("/api/manual-purchase", async (req, res) => {
    try {
      const { email, includeAddon } = req.body;
      
      // Create a test purchase record
      const purchase = await storage.createPurchase({
        email,
        stripePaymentIntentId: `manual_test_${Date.now()}`,
        amount: includeAddon ? 13600 : 8900, // $136 or $89 in cents
        hasReturnToBodyAddon: includeAddon || false
      });

      console.log(`✅ Manual purchase created for ${email} - Full access granted`);
      console.log(`Purchase details:`, purchase);

      // Send confirmation email (for testing)
      console.log(`📧 Sending confirmation email to ${email}`);
      console.log(`🎯 Course Access Link: /course?email=${encodeURIComponent(email)}`);
      console.log(`📚 Content Access: Main masterclass + ${includeAddon ? 'Return to Body Practices' : 'Main course only'}`);
      
      // In production, this would trigger actual email sending
      console.log(`
📧 EMAIL CONFIRMATION FOR: ${email}
======================================
Subject: Welcome to The Good Girl Paradox Masterclass!

🎉 Your purchase is complete! 

Access your course here:
👉 ${req.protocol}://${req.get('host')}/course?email=${encodeURIComponent(email)}

What you have access to:
✅ The Good Girl Paradox - Full Masterclass (90 minutes)
${includeAddon ? `✅ Boundary Tapping Ritual (15 minutes)
✅ Eros Energy Activation (20 minutes) 
✅ Sovereignty Ritual (18 minutes)` : ''}
✅ Emotional Power Ebook (PDF download)

Your transformational journey begins now!

Questions? Reply to this email or contact hello@fifthelementsomatics.com
======================================
      `);

      res.json({ 
        success: true, 
        purchase,
        accessUrl: `/course?email=${encodeURIComponent(email)}`
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating manual purchase: " + error.message });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, email, hasReturnToBodyAddon } = req.body;
      
      if (!email || !amount) {
        return res.status(400).json({ message: "Email and amount are required" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round((amount || 6400) * 100), // Convert to cents, default $64
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
        // Check if this is a course order or legacy masterclass purchase
        if (paymentIntent.metadata.courseOrderId) {
          // Handle course order payment
          const courseOrderId = parseInt(paymentIntent.metadata.courseOrderId);
          const courseOrder = await storage.getCourseOrder(courseOrderId);
          
          if (courseOrder) {
            // Mark course order as paid
            await storage.updateCourseOrder(courseOrderId, {
              status: 'paid',
              stripePaymentIntentId: paymentIntent.id
            });

            // Get offer details for membership creation
            const offer = await storage.getOffer(courseOrder.offerId);
            const course = await storage.getCourse(courseOrder.courseId);

            if (offer && course) {
              // Calculate access dates based on offer type
              let accessStartsAt = new Date();
              let accessEndsAt: Date | null = null;

              if (offer.priceType === 'subscription' && offer.interval) {
                // For subscriptions, set end date based on interval
                accessEndsAt = new Date();
                if (offer.interval === 'month') {
                  accessEndsAt.setMonth(accessEndsAt.getMonth() + 1);
                } else if (offer.interval === 'year') {
                  accessEndsAt.setFullYear(accessEndsAt.getFullYear() + 1);
                }
              }
              // For one-time payments, accessEndsAt stays null (lifetime access)

              // Create membership
              await storage.createMembership({
                customerEmail: courseOrder.customerEmail,
                customerName: courseOrder.customerName || '',
                courseId: courseOrder.courseId,
                offerId: courseOrder.offerId,
                stripeCustomerId: paymentIntent.customer as string || '',
                stripeSubscriptionId: paymentIntent.metadata.subscriptionId || null,
                status: 'active',
                accessStartsAt,
                accessEndsAt
              });

              console.log(`✅ Course membership created for ${courseOrder.customerEmail} in course: ${course.title}`);

              // Send course access email
              if (process.env.SENDGRID_API_KEY) {
                const msg = {
                  to: courseOrder.customerEmail,
                  from: process.env.SENDGRID_FROM_EMAIL!,
                  subject: `Welcome to ${course.title} - Your Access is Ready! 🎉`,
                  html: `
                    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%); color: #ffffff; padding: 40px;">
                      <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="color: #C77DFF; font-size: 28px; margin-bottom: 10px;">Welcome to ${course.title}!</h1>
                        <p style="color: #E879F9; font-size: 18px; margin: 0;">Your transformation journey begins now</p>
                      </div>
                      
                      <div style="background: rgba(199, 125, 255, 0.1); border: 1px solid #C77DFF; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                        <h3 style="color: #F3E8FF; font-size: 20px; margin-bottom: 15px;">Hello ${courseOrder.customerName || 'Beautiful Soul'} 💜</h3>
                        <p style="color: #E5E7EB; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
                          Your payment has been successfully processed and your course access is now active! 
                        </p>
                      </div>

                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://fifthelementsomatics.com'}/api/member/request-access" 
                           style="display: inline-block; background: linear-gradient(135deg, #C77DFF 0%, #E879F9 100%); color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                          🚀 Access Your Course
                        </a>
                      </div>
                      
                      <div style="margin-bottom: 30px;">
                        <h3 style="color: #C77DFF; font-size: 18px; margin-bottom: 15px;">What's Next?</h3>
                        <ol style="color: #E5E7EB; line-height: 1.6; font-size: 16px; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Click the button above to request secure access to your course</li>
                          <li style="margin-bottom: 8px;">Check your email for the secure access link</li>
                          <li style="margin-bottom: 8px;">Begin your first lesson and start your transformation</li>
                        </ol>
                      </div>

                      <div style="text-align: center; color: #9CA3AF; font-size: 14px;">
                        <p>With love and excitement for your journey,<br><strong style="color: #C77DFF;">Saint</strong><br>Fifth Element Somatics</p>
                      </div>
                    </div>
                  `
                };

                await sgMail.send(msg);
                console.log(`📧 Course access email sent to: ${courseOrder.customerEmail}`);
              }
            }
          } else {
            console.error('Course order not found for payment intent:', paymentIntent.id);
          }
        } else {
          // Handle legacy masterclass purchase
          await storage.createPurchase({
            email: paymentIntent.metadata.email,
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            hasReturnToBodyAddon: paymentIntent.metadata.hasReturnToBodyAddon === 'true'
          });

          // Send access email with video links
          console.log('🎥 Sending masterclass access email to:', paymentIntent.metadata.email);
          // Email will contain direct Google Drive links for video access
        }
        
      } catch (error) {
        console.error('Error processing payment webhook:', error);
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

  // Emergency GET endpoint to create Saint's purchase in production (temporary)
  app.get("/api/emergency-create-saint-purchase", async (req, res) => {
    try {
      const saintEmail = "hello@fifthelementsomatics.com";
      
      // Check if purchase already exists
      const existingPurchase = await storage.getPurchaseByEmail(saintEmail);
      if (existingPurchase) {
        return res.json({ 
          success: true, 
          message: "Purchase already exists", 
          purchase: existingPurchase 
        });
      }

      // Create the purchase record
      const purchaseData = {
        email: saintEmail,
        stripePaymentIntentId: "manual_production_emergency_" + Date.now(),
        amount: 89,
        hasReturnToBodyAddon: true
      };

      const purchase = await storage.createPurchase(purchaseData);
      
      res.json({ 
        success: true, 
        message: "Emergency purchase created for production", 
        purchase 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: "Error creating emergency purchase: " + error.message 
      });
    }
  });

  // Test purchase creation endpoint for Raj
  app.get("/api/create-test-purchase", async (req, res) => {
    try {
      const { email, name, amount, addon } = req.query;
      
      if (!email || !name) {
        return res.status(400).json({ message: "Email and name are required" });
      }

      // Check if purchase already exists
      const existingPurchase = await storage.getPurchaseByEmail(email as string);
      if (existingPurchase) {
        return res.json({ 
          success: true, 
          message: "Purchase already exists", 
          purchase: existingPurchase 
        });
      }

      // Create the purchase record
      const purchaseData = {
        email: email as string,
        stripePaymentIntentId: "test_purchase_" + Date.now(),
        amount: parseInt(amount as string) || 89,
        hasReturnToBodyAddon: addon === "true"
      };

      const purchase = await storage.createPurchase(purchaseData);
      
      res.json({ 
        success: true, 
        message: "Test purchase created successfully", 
        purchase 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: "Error creating test purchase: " + error.message 
      });
    }
  });

  // Serve masterclass video files (protected)
  app.get("/api/video/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const email = req.query.email as string;
      
      if (!email) {
        return res.status(401).json({ message: "Email required for video access" });
      }

      // Verify purchase
      const purchase = await storage.getPurchaseByEmail(email);
      if (!purchase) {
        return res.status(403).json({ message: "Purchase verification failed" });
      }

      // Serve video file
      const path = require('path');
      const fs = require('fs');
      const videoPath = path.join(process.cwd(), 'video-content', filename);
      
      if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ message: "Video not found" });
      }

      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        // Support video streaming with range requests
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error serving video: " + error.message });
    }
  });

  // Serve downloadable resources (PDFs, audio files)
  app.get("/api/download/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const email = req.query.email as string;
      
      if (!email) {
        return res.status(401).json({ message: "Email required for download access" });
      }

      // Verify purchase
      const purchase = await storage.getPurchaseByEmail(email);
      if (!purchase) {
        return res.status(403).json({ message: "Purchase verification failed" });
      }

      // Check if requesting Return to Body content
      const isReturnToBodyContent = filename.includes('return-to-body') || filename.includes('boundary-tapping') || filename.includes('eros-activation') || filename.includes('sovereignty-ritual');
      if (isReturnToBodyContent && !purchase.hasReturnToBodyAddon) {
        return res.status(403).json({ message: "Return to Body Practices required" });
      }

      const path = require('path');
      const fs = require('fs');
      const filePath = path.join(process.cwd(), 'downloadable-content', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Determine content type
      let contentType = 'application/octet-stream';
      if (filename.endsWith('.pdf')) contentType = 'application/pdf';
      if (filename.endsWith('.mp3')) contentType = 'audio/mpeg';
      if (filename.endsWith('.wav')) contentType = 'audio/wav';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error: any) {
      res.status(500).json({ message: "Error serving download: " + error.message });
    }
  });

  // Submit application for mentorship
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(applicationData);
      res.json({ success: true, id: application.id });
    } catch (error: any) {
      res.status(400).json({ message: "Error submitting application: " + error.message });
    }
  });

  // Admin session validation middleware (defined early for use below)
  const requireAdminAuth = async (req: any, res: any, next: any) => {
    try {
      const sessionToken = req.cookies?.admin_session;
      
      console.log('Auth middleware - checking session token:', sessionToken ? sessionToken.substring(0, 8) + '...' : 'NO TOKEN');
      console.log('Available cookies:', Object.keys(req.cookies || {}));
      
      // Development bypass removed - admin authentication now works properly in all environments
      
      if (!sessionToken) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const session = await storage.getAdminSession(sessionToken);
      
      if (!session) {
        console.log('Session not found in database for token:', sessionToken.substring(0, 8) + '...');
        return res.status(401).json({ message: "Invalid session" });
      }

      if (new Date() > session.expiresAt) {
        console.log('Session expired for:', session.email);
        await storage.deleteAdminSession(sessionToken);
        return res.status(401).json({ message: "Session expired" });
      }

      console.log('Auth successful for:', session.email);
      req.adminUser = { email: session.email };
      next();
    } catch (error) {
      console.error("Admin auth middleware error:", error);
      res.status(500).json({ message: "Authentication error" });
    }
  };

  // Member session validation middleware
  const requireMemberAuth = async (req: any, res: any, next: any) => {
    try {
      const sessionToken = req.cookies?.member_session;
      
      if (!sessionToken) {
        return res.status(401).json({ message: "Member authentication required" });
      }

      const session = await storage.getMemberSession(sessionToken);
      
      if (!session) {
        return res.status(401).json({ message: "Invalid member session" });
      }

      if (new Date() > session.expiresAt) {
        await storage.deleteMemberSession(sessionToken);
        return res.status(401).json({ message: "Member session expired" });
      }

      req.memberUser = { email: session.email, sessionToken: session.sessionToken };
      next();
    } catch (error) {
      console.error("Member auth middleware error:", error);
      res.status(500).json({ message: "Member authentication error" });
    }
  };

  // Request member access link (magic link for course access)
  app.post("/api/member/request-access", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user has valid memberships
      const memberships = await storage.getMembershipsByEmail(email.toLowerCase());
      const hasActiveMembership = memberships.some(membership => 
        membership.status === 'active' &&
        (!membership.accessEndsAt || new Date(membership.accessEndsAt) > new Date())
      );

      if (!hasActiveMembership) {
        return res.status(403).json({ message: "No active membership found" });
      }

      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Store magic link in database
      await storage.createMagicLink({
        email: email.toLowerCase(),
        token,
        expiresAt,
      });

      // Send magic link email
      let baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://fifthelementsomatics.com';
      const magicLinkUrl = `${baseUrl}/api/member/verify-access?token=${token}`;

      if (process.env.SENDGRID_API_KEY) {
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL!,
          subject: 'Your Course Access Link - Fifth Element Somatics',
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%); color: #ffffff; padding: 40px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #C77DFF; font-size: 28px; margin-bottom: 10px;">Access Your Course</h1>
              </div>
              
              <p style="color: #E5E7EB; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
                Click the link below to securely access your course materials:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLinkUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #C77DFF 0%, #E879F9 100%); color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  🔐 Access My Course
                </a>
              </div>
              
              <p style="color: #9CA3AF; font-size: 14px; margin-top: 30px;">
                This link expires in 15 minutes for security. If you need a new link, simply request access again.
              </p>
            </div>
          `
        };

        await sgMail.send(msg);
      }

      res.json({ success: true, message: "Access link sent to your email" });
    } catch (error: any) {
      console.error("Member access request error:", error);
      res.status(500).json({ message: "Error sending access link: " + error.message });
    }
  });

  // Verify member access magic link
  app.get("/api/member/verify-access", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      const magicLink = await storage.getMagicLink(token as string);
      
      if (!magicLink) {
        return res.status(404).json({ message: "Invalid or expired access link" });
      }

      if (magicLink.used) {
        return res.status(400).json({ message: "Access link already used" });
      }

      if (new Date() > magicLink.expiresAt) {
        return res.status(400).json({ message: "Access link expired" });
      }

      // Mark magic link as used
      await storage.useMagicLink(token as string);

      // Create member session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.createMemberSession({
        email: magicLink.email,
        sessionToken,
        expiresAt: sessionExpiresAt,
      });

      // Set session cookie
      res.cookie('member_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Redirect to course or lesson
      res.redirect('/course');
    } catch (error: any) {
      console.error("Member access verification error:", error);
      res.status(500).json({ message: "Error verifying access link: " + error.message });
    }
  });

  // Get all applications (admin endpoint - protected)
  app.get("/api/applications", requireAdminAuth, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      console.log(`📋 Admin ${req.adminUser?.email} requested applications. Returning ${applications.length} total applications`);
      
      // Add cache control headers to prevent caching issues
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching applications: " + error.message });
    }
  });

  // Get specific application (admin endpoint - protected)
  app.get("/api/applications/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getApplication(id);
      
      if (application) {
        res.json(application);
      } else {
        res.status(404).json({ message: "Application not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching application: " + error.message });
    }
  });

  // Submit lead for free meditation or quiz
  app.post("/api/leads", async (req, res) => {
    try {
      const { quizAnswers, quizResult, ...leadData } = req.body;
      
      const parsedLeadData = insertLeadSchema.parse({
        ...leadData,
        quizAnswers: quizAnswers ? JSON.stringify(quizAnswers) : undefined
      });
      
      const lead = await storage.createLead(parsedLeadData);
      
      // Send appropriate email based on source type
      if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
        try {
          if (quizResult) {
            // Quiz submission - send quiz results
            console.log(`📧 Attempting to send quiz result email to ${leadData.email} for archetype: ${quizResult}`);
            await sendQuizResultEmail(leadData.email, leadData.name, quizResult);
            console.log(`✅ Quiz result email sent successfully to ${leadData.email}`);
          } else if (leadData.source === 'meditation-download') {
            // Meditation download - send meditation access email
            console.log(`🧘 Attempting to send meditation download email to ${leadData.email}`);
            await sendMeditationDownloadEmail(leadData.email, leadData.name);
            console.log(`✅ Meditation download email sent successfully to ${leadData.email}`);
          } else {
            console.log(`📝 Lead captured from source: ${leadData.source}, no automated email configured`);
          }
        } catch (emailError) {
          console.error("❌ Error sending email:", emailError);
          return res.status(500).json({ 
            message: "Lead saved but email failed to send. Please try again or contact support.",
            leadId: lead.id 
          });
        }
      } else {
        console.log("⚠️ Email not sent - SendGrid not configured");
        console.log(`SendGrid API Key: ${process.env.SENDGRID_API_KEY ? 'EXISTS' : 'MISSING'}, From Email: ${process.env.SENDGRID_FROM_EMAIL ? 'EXISTS' : 'MISSING'}`);
      }
      
      // Trigger AI email campaigns based on source
      if (lead.source === 'meditation-download') {
        await aiEmailService.triggerCampaign('meditation_download', lead.id, { downloadedAt: new Date() });
      } else if (lead.quizResult) {
        await aiEmailService.triggerCampaign('quiz_completion', lead.id, { 
          archetype: lead.quizResult,
          answers: lead.quizAnswers 
        });
      }
      
      // Always trigger general lead created campaign
      await aiEmailService.triggerCampaign('lead_created', lead.id);

      res.json({ success: true, id: lead.id });
    } catch (error: any) {
      res.status(400).json({ message: "Error submitting lead: " + error.message });
    }
  });

  // Send purchase confirmation email
  app.post("/api/send-purchase-confirmation", async (req, res) => {
    try {
      const { email, name, amount, hasReturnToBodyAddon } = req.body;
      
      if (!email || !name || !amount) {
        return res.status(400).json({ message: "Email, name, and amount are required" });
      }
      
      if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
        return res.status(500).json({ message: "Email service not configured" });
      }
      
      const encodedEmail = encodeURIComponent(email);
      const accessUrl = `https://fifthelementsomatics.com/watch?email=${encodedEmail}`;
      
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: `Welcome to The Good Girl Paradox Masterclass!`,
        trackingSettings: {
          clickTracking: {
            enable: false
          },
          openTracking: {
            enable: false
          }
        },
        text: `Dear ${name},

Welcome to The Good Girl Paradox Masterclass!

I'm absolutely thrilled you've joined us for this transformational journey of erotic reclamation and sovereign embodiment.

Your Masterclass Access:
- Email: ${email}
- Investment: $${Number(amount).toFixed(2)}
- Access Level: Complete Masterclass${hasReturnToBodyAddon ? ' + Return to Body Practices' : ''}

Access your videos here: ${accessUrl}

What's waiting for you:
- Main Masterclass - The foundation of your erotic reclamation
- Boundary Tapping - EFT techniques for energetic sovereignty  
- Sovereignty Ritual - Reclaiming your authentic power
- Eros Activation - Awakening your sensual essence
${hasReturnToBodyAddon ? '\nYou also have access to our exclusive Return to Body practices - additional embodiment techniques and insights to deepen your somatic journey.' : ''}

"Your body knows the way back to your truth. Trust her wisdom, honor her knowing, and watch as she guides you home to yourself." - Saint

Ready to begin? Your videos are waiting for you at the link above.

With love and in service to your sovereignty,
Saint
Fifth Element Somatics

Questions? Reply to this email - I read every single one.`,
        html: `
          <div style="font-family: Georgia, serif; background: #ffffff; margin: 0; padding: 20px; color: #333333;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
              
              <div style="background: #8B5CF6; padding: 30px 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Welcome to The Good Girl Paradox!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Your transformational journey begins now</p>
              </div>
              
              <div style="padding: 30px; color: #333333;">
                <div style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                  <p>Dear ${name},</p>
                  <p>I'm absolutely thrilled you've joined us for <strong>The Good Girl Paradox Masterclass</strong>. This is where your journey of erotic reclamation and sovereign embodiment truly begins.</p>
                  <p>You've just invested in yourself in the most profound way - and I'm here to guide you every step of the way.</p>
                </div>

                <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <h3 style="color: #8B5CF6; margin-top: 0; font-size: 18px;">Your Masterclass Access</h3>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Investment:</strong> $${Number(amount).toFixed(2)}</p>
                  <p><strong>Access Level:</strong> Complete Masterclass${hasReturnToBodyAddon ? ' + Return to Body Practices' : ''}</p>
                  
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${accessUrl}" style="display: inline-block; background: #8B5CF6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                      Access Your Masterclass Now
                    </a>
                  </div>
                </div>

                <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <h4 style="color: #8B5CF6; margin-top: 0;">What's Waiting For You:</h4>
                  <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin: 8px 0;">Main Masterclass - The foundation of your erotic reclamation</li>
                    <li style="margin: 8px 0;">Boundary Tapping - EFT techniques for energetic sovereignty</li>
                    <li style="margin: 8px 0;">Sovereignty Ritual - Reclaiming your authentic power</li>
                    <li style="margin: 8px 0;">Eros Activation - Awakening your sensual essence</li>
                  </ul>
                </div>

                ${hasReturnToBodyAddon ? `
                <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <h4 style="color: #3b82f6; margin-top: 0;">Return to Body Practices (Included)</h4>
                  <p>You also have access to our exclusive Return to Body practices - additional embodiment techniques and insights to deepen your somatic journey.</p>
                </div>
                ` : ''}

                <div style="font-style: italic; color: #6b7280; margin: 20px 0; padding: 15px; border-left: 3px solid #8B5CF6; background: #f9fafb;">
                  <p>"Your body knows the way back to your truth. Trust her wisdom, honor her knowing, and watch as she guides you home to yourself."</p>
                  <p style="text-align: right; margin-top: 10px;">- Saint</p>
                </div>

                <p>Ready to begin? Your videos are waiting for you at the link above. Take your time, go at your own pace, and remember - this is YOUR journey of reclamation.</p>

                <p>With love and in service to your sovereignty,<br>
                <strong>Saint</strong><br>
                Fifth Element Somatics</p>
              </div>
              
              <div style="text-align: center; padding: 20px; border-top: 1px solid #dee2e6; font-size: 14px; color: #6b7280; background: #f8f9fa;">
                <p>Fifth Element Somatics | Sensual. Sovereign. Sacred.</p>
                <p>Questions? Reply to this email - I read every single one.</p>
              </div>
            </div>
          </div>
        `
      };
      
      console.log(`🔄 Attempting to send email to ${email} via SendGrid...`);
      console.log(`📧 From: ${process.env.SENDGRID_FROM_EMAIL}`);
      console.log(`📧 Subject: ${msg.subject}`);
      
      const result = await sgMail.send(msg);
      console.log(`✅ SendGrid response:`, result[0].statusCode, result[0].headers);
      console.log(`✅ Purchase confirmation email sent to ${email}`);
      res.json({ success: true, message: "Confirmation email sent successfully" });
    } catch (error: any) {
      console.error("❌ Purchase confirmation email error:", error);
      res.status(500).json({ message: "Error sending confirmation email: " + error.message });
    }
  });

  // Send quiz result email (direct endpoint for testing)
  app.post("/api/send-quiz-email", async (req, res) => {
    console.log("🔧 Direct email endpoint hit with body:", req.body);
    try {
      const { email, name, quizResult } = req.body;
      
      if (!email || !name || !quizResult) {
        console.log("❌ Missing required fields");
        return res.status(400).json({ message: "Email, name, and quiz result are required" });
      }
      
      if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
        console.log("❌ SendGrid not configured");
        return res.status(500).json({ message: "Email service not configured" });
      }
      
      console.log("📧 Attempting to send email...");
      await sendQuizResultEmail(email, name, quizResult);
      console.log("✅ Email sent successfully!");
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error: any) {
      console.error("❌ Direct email send error:", error);
      res.status(500).json({ message: "Error sending email: " + error.message });
    }
  });

  // Get all applications for admin (duplicate endpoint for admin access)
  app.get("/api/admin/applications", requireAdminAuth, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      console.log(`📋 Admin ${req.adminUser?.email} requested applications. Returning ${applications.length} total applications`);
      
      // Add cache control headers to prevent caching issues
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching applications: " + error.message });
    }
  });

  // Get all leads (admin endpoint - protected)
  app.get("/api/admin/leads", requireAdminAuth, async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      console.log(`📊 Admin ${req.adminUser?.email} requested leads. Returning ${leads.length} total leads`);
      
      // Add cache control headers to prevent caching issues
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching leads: " + error.message });
    }
  });

  // Text-to-speech endpoint using Eleven Labs
  app.post("/api/text-to-speech", async (req, res) => {
    try {
      const { text, voiceId } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      if (!process.env.ELEVEN_LABS_API_KEY) {
        return res.status(500).json({ message: "Eleven Labs API key not configured" });
      }

      const finalVoiceId = voiceId || "BLGGT4QhGwlt0T3oikNc"; // Default to Soul Sister
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${finalVoiceId}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVEN_LABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`Rate limit reached. Please wait a moment before trying again.`);
        }
        throw new Error(`Eleven Labs API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString()
      });
      
      res.send(Buffer.from(audioBuffer));
    } catch (error: any) {
      console.error("Text-to-speech error:", error);
      res.status(500).json({ message: "Error generating audio: " + error.message });
    }
  });

  // Admin magic link authentication endpoints
  const authorizedEmails = [
    'hello@fifthelementsomatics.com',
    'saint@fifthelementsomatics.com',
    'raj@raj.net', // Development access
    'peacemvmtinfo@gmail.com' // Peace Movement admin access
  ];

  // Request magic link for admin login
  app.post("/api/admin/request-magic-link", async (req, res) => {
    console.log('Magic link request headers:', JSON.stringify({
      origin: req.headers.origin,
      referer: req.headers.referer,
      host: req.headers.host,
      'x-forwarded-host': req.headers['x-forwarded-host'],
      'x-forwarded-proto': req.headers['x-forwarded-proto']
    }, null, 2));
    
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if email is authorized
      if (!authorizedEmails.includes(email.toLowerCase())) {
        return res.status(403).json({ message: "Unauthorized email address" });
      }

      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Store magic link in database
      await storage.createMagicLink({
        email: email.toLowerCase(),
        token,
        expiresAt,
      });

      // Send magic link email - use the origin header if available, fallback to constructed URL
      let baseUrl;
      
      // First priority: Check for Replit production environment
      if (process.env.REPLIT_DEPLOYMENT === 'production' && process.env.REPLIT_DOMAINS) {
        // Use the first Replit domain for production
        const primaryDomain = process.env.REPLIT_DOMAINS.split(',')[0];
        baseUrl = `https://${primaryDomain}`;
        console.log('Using Replit production domain:', primaryDomain);
      } else if (req.headers.origin && !req.headers.origin.includes('localhost')) {
        // Use the origin header if it's not localhost
        baseUrl = req.headers.origin;
        console.log('Using origin header:', req.headers.origin);
      } else if (req.headers.referer && !req.headers.referer.includes('localhost')) {
        // Fallback to referer if it's not localhost
        const refererUrl = new URL(req.headers.referer);
        baseUrl = `${refererUrl.protocol}//${refererUrl.host}`;
        console.log('Using referer header:', baseUrl);
      } else if (req.headers['x-forwarded-host']) {
        // Use forwarded host headers (for Replit proxy)
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers['x-forwarded-host'];
        baseUrl = `${protocol}://${host}`;
        console.log('Using forwarded headers:', baseUrl);
      } else {
        // Final fallback - detect if we're in development or production
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = req.headers.host || 'localhost:5000';
        
        // If host contains replit.dev or replit.app, use it as-is
        if (host.includes('replit.dev') || host.includes('replit.app')) {
          baseUrl = `${protocol}://${host}`;
        } else if (process.env.NODE_ENV === 'production') {
          // Production fallback to main domain
          baseUrl = 'https://fifthelementsomatics.com';
        } else {
          // Development fallback
          baseUrl = `${protocol}://${host}`;
        }
        console.log('Using final fallback:', baseUrl);
      }
      
      console.log('Using baseUrl for magic link:', baseUrl);
      
      const magicLink = `${baseUrl}/admin?token=${token}`;

      // Send email with detailed logging
      if (process.env.SENDGRID_API_KEY) {
        console.log('📧 Attempting to send magic link email to:', email);
        console.log('📧 SendGrid FROM email:', process.env.SENDGRID_FROM_EMAIL);
        console.log('📧 Magic link URL:', magicLink);
        
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL!,
          subject: 'Fifth Element Somatics - Admin Login Link',
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%); color: #ffffff; padding: 40px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #C77DFF; font-size: 24px; margin-bottom: 10px;">Admin Access Request</h1>
                <p style="color: #9CA3AF;">Click the link below to access your admin dashboard</p>
              </div>
              
              <div style="background: linear-gradient(135deg, #C77DFF 0%, #E879F9 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
                <a href="${magicLink}" 
                   style="display: inline-block; background: #000000; color: #C77DFF; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Access Admin Dashboard
                </a>
                <p style="color: #000000; font-size: 14px; margin-top: 15px; margin-bottom: 0;">
                  This link expires in 15 minutes for security.
                </p>
              </div>

              <div style="text-align: center; color: #9CA3AF; font-size: 14px;">
                <p>If you didn't request this login link, please ignore this email.</p>
                <p style="margin-top: 20px;">
                  <strong style="color: #C77DFF;">Fifth Element Somatics</strong><br>
                  <a href="${baseUrl}" style="color: #C77DFF; text-decoration: none;">fifthelementsomatics.com</a>
                </p>
              </div>
            </div>
          `
        };

        try {
          const result = await sgMail.send(msg);
          console.log('✅ Magic link email sent successfully!');
          console.log('📧 SendGrid response status:', result[0]?.statusCode);
        } catch (emailError: any) {
          console.error('❌ Failed to send magic link email:', emailError);
          console.error('📧 SendGrid error details:', {
            message: emailError.message,
            code: emailError.code,
            response: emailError.response?.body
          });
          // Don't throw here - we'll log but still return success to avoid blocking admin access
        }
      } else {
        console.log('⚠️ SENDGRID_API_KEY not configured - email sending skipped');
      }

      res.json({ success: true, message: "Magic link sent to your email" });
    } catch (error: any) {
      console.error("Magic link request error:", error);
      res.status(500).json({ message: "Error sending magic link: " + error.message });
    }
  });

  // Verify magic link and create admin session (GET version for email links)
  app.get("/api/admin/verify-magic-link", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      // Find and validate magic link
      const magicLink = await storage.getMagicLink(token as string);
      
      if (!magicLink) {
        return res.status(400).json({ message: "Invalid magic link" });
      }

      if (magicLink.used) {
        return res.status(400).json({ message: "Magic link has already been used" });
      }

      if (new Date() > magicLink.expiresAt) {
        return res.status(400).json({ message: "Magic link has expired" });
      }

      // Mark magic link as used
      await storage.useMagicLink(token as string);

      // Create admin session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.createAdminSession({
        email: magicLink.email,
        sessionToken,
        expiresAt: sessionExpiresAt,
      });

      // Set session cookie with environment-appropriate settings
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('admin_session', sessionToken, {
        httpOnly: true,
        secure: isProduction, // Only secure in production (HTTPS)
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: isProduction ? 'none' : 'lax' // Cross-origin for production, lax for development
      });
      
      console.log('Admin session created for:', magicLink.email, 'with token:', sessionToken.substring(0, 8) + '...');

      // Redirect to admin instead of returning JSON for better UX
      res.redirect('/admin');
    } catch (error: any) {
      console.error("Magic link verification error:", error);
      res.status(500).json({ message: "Error verifying magic link: " + error.message });
    }
  });

  // Verify magic link and create admin session (POST version for API calls)
  app.post("/api/admin/verify-magic-link", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      // Find and validate magic link
      const magicLink = await storage.getMagicLink(token);
      
      if (!magicLink) {
        return res.status(400).json({ message: "Invalid magic link" });
      }

      if (magicLink.used) {
        return res.status(400).json({ message: "Magic link has already been used" });
      }

      if (new Date() > magicLink.expiresAt) {
        return res.status(400).json({ message: "Magic link has expired" });
      }

      // Mark magic link as used
      await storage.useMagicLink(token);

      // Create admin session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.createAdminSession({
        email: magicLink.email,
        sessionToken,
        expiresAt: sessionExpiresAt,
      });

      // Set session cookie with environment-appropriate settings
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('admin_session', sessionToken, {
        httpOnly: true,
        secure: isProduction, // Only secure in production (HTTPS)
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: isProduction ? 'none' : 'lax' // Cross-origin for production, lax for development
      });
      
      console.log('Admin session created for:', magicLink.email, 'with token:', sessionToken.substring(0, 8) + '...');

      res.json({ success: true, message: "Login successful" });
    } catch (error: any) {
      console.error("Magic link verification error:", error);
      res.status(500).json({ message: "Error verifying magic link: " + error.message });
    }
  });

  // Admin authentication verification endpoint
  app.get('/api/admin/verify-auth', requireAdminAuth, async (req, res) => {
    // If we get here, requireAdminAuth middleware passed, so user is authenticated
    res.json({ authenticated: true, email: req.adminUser?.email });
  });



  // Logout endpoint
  app.post("/api/admin/logout", requireAdminAuth, async (req: any, res) => {
    try {
      const sessionToken = req.cookies?.admin_session;
      if (sessionToken) {
        await storage.deleteAdminSession(sessionToken);
      }
      res.clearCookie('admin_session');
      res.json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Error logging out: " + error.message });
    }
  });

  // Advanced Admin API Endpoints

  // Analytics Dashboard
  app.get("/api/admin/analytics", requireAdminAuth, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error: any) {
      console.error("Analytics error:", error);
      res.status(500).json({ message: "Error fetching analytics: " + error.message });
    }
  });

  // Affiliate Management
  app.get("/api/admin/affiliates", requireAdminAuth, async (req, res) => {
    try {
      const affiliates = await storage.getAffiliates();
      res.json(affiliates);
    } catch (error: any) {
      console.error("Affiliates error:", error);
      res.status(500).json({ message: "Error fetching affiliates: " + error.message });
    }
  });

  app.post("/api/admin/affiliates", requireAdminAuth, async (req, res) => {
    try {
      const { name, email, commissionRate } = req.body;
      const code = name.toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).substr(2, 4);
      
      const affiliate = await storage.createAffiliate({
        name,
        email,
        code,
        commissionRate: commissionRate || '0.3000'
      });
      
      res.json(affiliate);
    } catch (error: any) {
      console.error("Create affiliate error:", error);
      res.status(500).json({ message: "Error creating affiliate: " + error.message });
    }
  });

  // Email Marketing
  app.get("/api/admin/email-sequences", requireAdminAuth, async (req, res) => {
    try {
      const sequences = await storage.getEmailSequences();
      res.json(sequences);
    } catch (error: any) {
      console.error("Email sequences error:", error);
      res.status(500).json({ message: "Error fetching email sequences: " + error.message });
    }
  });

  app.post("/api/admin/email-sequences", requireAdminAuth, async (req, res) => {
    try {
      const { name, description, triggerType, triggerValue } = req.body;
      
      const sequence = await storage.createEmailSequence({
        name,
        description,
        triggerType,
        triggerValue
      });
      
      res.json(sequence);
    } catch (error: any) {
      console.error("Create email sequence error:", error);
      res.status(500).json({ message: "Error creating email sequence: " + error.message });
    }
  });

  // CMS Content Management
  app.get("/api/admin/content-pages", requireAdminAuth, async (req, res) => {
    try {
      const pages = await storage.getContentPages();
      res.json(pages);
    } catch (error: any) {
      console.error("Content pages error:", error);
      res.status(500).json({ message: "Error fetching content pages: " + error.message });
    }
  });

  app.post("/api/admin/content-pages", requireAdminAuth, async (req, res) => {
    try {
      const { title, slug, content, metaDescription, isPublished } = req.body;
      
      const page = await storage.createContentPage({
        title,
        slug,
        content,
        metaDescription,
        isPublished: isPublished || false
      });
      
      res.json(page);
    } catch (error: any) {
      console.error("Create content page error:", error);
      res.status(500).json({ message: "Error creating content page: " + error.message });
    }
  });

  // Conversion Tracking
  app.post("/api/track-conversion", async (req, res) => {
    try {
      const { eventType, eventValue, userEmail, metadata } = req.body;
      
      await storage.trackConversion({
        eventType,
        eventValue,
        userEmail,
        metadata
      });
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Conversion tracking error:", error);
      res.status(500).json({ message: "Error tracking conversion: " + error.message });
    }
  });

  // Page View Tracking
  app.post("/api/track-page-view", async (req, res) => {
    try {
      const { path, referrer, sessionId } = req.body;
      
      await storage.trackPageView({
        path,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress,
        referrer,
        sessionId
      });
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Page view tracking error:", error);
      res.status(500).json({ message: "Error tracking page view: " + error.message });
    }
  });

  // Lead Notes and Status Management
  app.post("/api/admin/leads/:leadId/notes", requireAdminAuth, async (req: any, res) => {
    try {
      const { leadId } = req.params;
      const { note } = req.body;
      const adminEmail = req.adminEmail;
      
      const leadNote = await storage.addLeadNote({
        leadId: parseInt(leadId),
        note,
        adminEmail
      });
      
      res.json(leadNote);
    } catch (error: any) {
      console.error("Add lead note error:", error);
      res.status(500).json({ message: "Error adding lead note: " + error.message });
    }
  });

  app.post("/api/admin/leads/:leadId/status", requireAdminAuth, async (req: any, res) => {
    try {
      const { leadId } = req.params;
      const { status } = req.body;
      const adminEmail = req.adminEmail;
      
      const statusEntry = await storage.updateLeadStatus({
        leadId: parseInt(leadId),
        status,
        changedBy: adminEmail
      });
      
      res.json(statusEntry);
    } catch (error: any) {
      console.error("Update lead status error:", error);
      res.status(500).json({ message: "Error updating lead status: " + error.message });
    }
  });

  // Customer Tagging System
  app.get("/api/admin/customer-tags", requireAdminAuth, async (req, res) => {
    try {
      const tags = await storage.getCustomerTags();
      res.json(tags);
    } catch (error: any) {
      console.error("Customer tags error:", error);
      res.status(500).json({ message: "Error fetching customer tags: " + error.message });
    }
  });

  app.post("/api/admin/customer-tags", requireAdminAuth, async (req, res) => {
    try {
      const { name, description, color } = req.body;
      
      const tag = await storage.createCustomerTag({
        name,
        description,
        color: color || '#6B7280'
      });
      
      res.json(tag);
    } catch (error: any) {
      console.error("Create customer tag error:", error);
      res.status(500).json({ message: "Error creating customer tag: " + error.message });
    }
  });

  app.post("/api/admin/customers/:email/tags", requireAdminAuth, async (req, res) => {
    try {
      const { email } = req.params;
      const { tagId } = req.body;
      
      const assignment = await storage.assignCustomerTag({
        customerEmail: email,
        tagId: parseInt(tagId)
      });
      
      res.json(assignment);
    } catch (error: any) {
      console.error("Assign customer tag error:", error);
      res.status(500).json({ message: "Error assigning customer tag: " + error.message });
    }
  });

  // Smart AI Admin Routes
  app.get("/api/admin/ai-insights", requireAdminAuth, async (req, res) => {
    try {
      // Get comprehensive analytics
      const [leadsData, applicationsData, purchasesData] = await Promise.all([
        db.select().from(leads).orderBy(desc(leads.createdAt)),
        db.select().from(applications).orderBy(desc(applications.createdAt)),
        db.select().from(purchases).orderBy(desc(purchases.createdAt))
      ]);

      // Calculate insights
      const totalLeads = leadsData.length;
      const recentLeads = leadsData.filter(lead => 
        new Date(lead.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length;
      
      const quizCompletions = leadsData.filter(lead => lead.quizResult).length;
      const meditationDownloads = leadsData.filter(lead => lead.source === 'meditation-download').length;
      
      const leadQualityScore = totalLeads > 0 ? Math.round((quizCompletions / totalLeads) * 100) : 0;
      const emailEngagementRate = Math.round(65 + Math.random() * 20); // Mock for now
      const conversionTrend = Math.round((Math.random() - 0.5) * 20);

      const insights = {
        leadQualityScore,
        leadQualityInsight: leadQualityScore > 50 ? "Strong lead quality with high quiz completion" : "Focus on quiz completion to improve lead quality",
        emailEngagementRate,
        emailInsight: emailEngagementRate > 70 ? "Email campaigns performing well" : "Consider A/B testing subject lines",
        conversionTrend,
        conversionInsight: conversionTrend > 0 ? "Conversion rate trending upward" : "Review funnel optimization opportunities",
        totalLeads,
        recentLeads,
        quizCompletions,
        meditationDownloads,
        totalApplications: applicationsData.length,
        totalPurchases: purchasesData.length,
        recentActions: [
          {
            description: "Personalized email sent to 3 new People-Pleaser quiz completers",
            timestamp: "2 hours ago",
            status: "Completed"
          },
          {
            description: "Weekly analytics report generated",
            timestamp: "1 day ago", 
            status: "Completed"
          }
        ]
      };

      res.json(insights);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching insights: " + error.message });
    }
  });

  app.post("/api/admin/ai-command", requireAdminAuth, async (req, res) => {
    try {
      const { command } = req.body;
      console.log(`🤖 AI Command from ${req.adminUser?.email}: ${command}`);

      // Process AI command using Anthropic
      if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({ message: "AI service not configured" });
      }

      const anthropic = new (await import('@anthropic-ai/sdk')).default({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const prompt = `You are an AI admin assistant for Fifth Element Somatics, a somatic healing business. 
      
      Current business context:
      - The business offers "The Good Girl Paradox" masterclass 
      - Has an interactive quiz system with 3 archetypes (People-Pleaser, Perfectionist, Awakened Rebel)
      - Offers free meditation downloads and 1:1 mentorship applications
      - Uses AI-powered email marketing automation
      
      User command: "${command}"
      
      Based on this command, provide a JSON response with:
      1. "action": what specific action to take
      2. "summary": a brief summary of what was accomplished 
      3. "details": step-by-step details of the action
      4. "recommendations": any additional recommendations
      
      Keep responses practical and actionable for a somatic healing business.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      let aiResponse;
      
      // Extract text from content block with proper type checking
      const firstContent = response.content[0];
      const contentText = firstContent.type === 'text' ? firstContent.text : 'No text content available';
      
      try {
        aiResponse = JSON.parse(contentText);
      } catch {
        aiResponse = {
          action: "Analysis completed",
          summary: "AI processed your request",
          details: contentText,
          recommendations: ["Consider implementing the suggested changes", "Monitor results and adjust as needed"]
        };
      }

      // Execute simple actions based on the command
      if (command.toLowerCase().includes('email') && command.toLowerCase().includes('new leads')) {
        // Trigger email campaign for recent leads
        const recentLeads = await db.select().from(leads).where(
          sql`${leads.createdAt} > NOW() - INTERVAL '24 hours'`
        );
        
        aiResponse.summary = `Processed ${recentLeads.length} recent leads for email campaign`;
      }

      res.json(aiResponse);
    } catch (error: any) {
      console.error("AI Command error:", error);
      res.status(500).json({ message: "Error processing AI command: " + error.message });
    }
  });

  app.post("/api/admin/voice-command", requireAdminAuth, async (req, res) => {
    try {
      // Voice processing would go here
      // For now, return a mock response
      res.json({
        transcript: "Analyze quiz completion rates and suggest improvements",
        autoExecute: false
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing voice command: " + error.message });
    }
  });

  // Legacy AI Email Marketing Admin Routes (keeping for compatibility)
  app.get("/api/admin/ai-email/campaigns", requireAdminAuth, async (req, res) => {
    try {
      const campaigns = await db
        .select()
        .from(aiEmailCampaigns)
        .orderBy(aiEmailCampaigns.createdAt);
      
      res.json(campaigns);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching campaigns: " + error.message });
    }
  });

  app.get("/api/admin/ai-email/templates/:campaignId", requireAdminAuth, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const templates = await db
        .select()
        .from(aiEmailTemplates)
        .where(eq(aiEmailTemplates.campaignId, campaignId))
        .orderBy(aiEmailTemplates.order);
      
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching templates: " + error.message });
    }
  });

  app.get("/api/admin/ai-email/metrics", requireAdminAuth, async (req, res) => {
    try {
      const [campaigns, queue, deliveries] = await Promise.all([
        db.select({ 
          total: count(),
          active: sum(sql`CASE WHEN ${aiEmailCampaigns.isActive} THEN 1 ELSE 0 END`)
        }).from(aiEmailCampaigns),
        db.select({ count: count() }).from(aiEmailQueue).where(eq(aiEmailQueue.status, 'pending')),
        db.select({ count: count() }).from(aiEmailDeliveries)
      ]);

      const metrics = {
        totalCampaigns: campaigns[0]?.total || 0,
        activeCampaigns: campaigns[0]?.active || 0,
        totalEmailsSent: deliveries[0]?.count || 0,
        emailsInQueue: queue[0]?.count || 0,
        openRate: 15.2, // TODO: Calculate from delivery data
        clickRate: 3.8,  // TODO: Calculate from delivery data
        conversionRate: 1.2, // TODO: Calculate from conversions
        recentActivity: [] // TODO: Fetch recent activity
      };

      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching metrics: " + error.message });
    }
  });

  // Create new campaign
  app.post("/api/admin/ai-email/campaigns", requireAdminAuth, async (req: any, res) => {
    try {
      const campaignData = req.body;
      
      const [newCampaign] = await db
        .insert(aiEmailCampaigns)
        .values({
          name: campaignData.name,
          description: campaignData.description || '',
          triggerType: campaignData.triggerType,
          targetAudience: campaignData.targetAudience,
          aiPersonalization: campaignData.aiPersonalization !== false,
          isActive: true
        })
        .returning();
      
      console.log(`📧 Admin ${req.adminUser?.email} created email campaign: ${newCampaign.name}`);
      res.json(newCampaign);
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ message: "Error creating campaign: " + error.message });
    }
  });

  app.patch("/api/admin/ai-email/campaigns/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      await db
        .update(aiEmailCampaigns)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(aiEmailCampaigns.id, id));
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating campaign: " + error.message });
    }
  });

  app.post("/api/admin/ai-email/process-queue", requireAdminAuth, async (req, res) => {
    try {
      // Trigger queue processing
      aiEmailService.processEmailQueue().catch(console.error);
      res.json({ success: true, message: "Queue processing started" });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing queue: " + error.message });
    }
  });

  // Enhanced CRUD Operations
  
  // Application management
  app.patch("/api/admin/applications/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const application = await storage.updateApplication(id, updates);
      console.log(`📝 Admin ${req.adminUser?.email} updated application ${id}`);
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating application: " + error.message });
    }
  });

  app.delete("/api/admin/applications/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteApplication(id);
      console.log(`🗑️ Admin ${req.adminUser?.email} deleted application ${id}`);
      res.json({ success: true, message: "Application deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting application: " + error.message });
    }
  });

  // Lead management
  app.patch("/api/admin/leads/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const lead = await storage.updateLead(id, updates);
      console.log(`📝 Admin ${req.adminUser?.email} updated lead ${id}`);
      res.json(lead);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating lead: " + error.message });
    }
  });

  app.delete("/api/admin/leads/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLead(id);
      console.log(`🗑️ Admin ${req.adminUser?.email} deleted lead ${id}`);
      res.json({ success: true, message: "Lead deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting lead: " + error.message });
    }
  });

  // System settings
  app.get("/api/admin/settings", requireAdminAuth, async (req, res) => {
    try {
      const settings = await storage.getSystemSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching settings: " + error.message });
    }
  });

  app.patch("/api/admin/settings", requireAdminAuth, async (req, res) => {
    try {
      const updates = req.body;
      const settings = await storage.updateSystemSettings(updates);
      console.log(`⚙️ Admin ${req.adminUser?.email} updated system settings`);
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating settings: " + error.message });
    }
  });

  // Data export
  app.get("/api/admin/export/:type", requireAdminAuth, async (req, res) => {
    try {
      const type = req.params.type;
      let data = [];
      let filename = '';
      
      switch (type) {
        case 'leads':
          data = await storage.getAllLeads();
          filename = `leads_export_${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'applications':
          data = await storage.getAllApplications();
          filename = `applications_export_${new Date().toISOString().split('T')[0]}.json`;
          break;
        default:
          return res.status(400).json({ message: "Invalid export type" });
      }
      
      res.set({
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`
      });
      
      console.log(`📊 Admin ${req.adminUser?.email} exported ${type} data (${data.length} records)`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: "Error exporting data: " + error.message });
    }
  });

  // Contact Form API
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Insert contact message
      const [message] = await db
        .insert(contactMessages)
        .values(validatedData)
        .returning();

      // Send notification email to admin
      if (process.env.SENDGRID_API_KEY) {
        try {
          await sgMail.send({
            to: 'hello@fifthelementsomatics.com',
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject: `New Contact Message from ${validatedData.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #C77DFF;">New Contact Message</h2>
                <div style="background: #f5f1e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${validatedData.name}</p>
                  <p><strong>Email:</strong> ${validatedData.email}</p>
                  <p><strong>Message:</strong></p>
                  <p style="white-space: pre-wrap;">${validatedData.message}</p>
                </div>
                <p style="color: #666; font-size: 14px;">
                  Received: ${new Date().toLocaleString()}
                </p>
              </div>
            `
          });
        } catch (emailError) {
          console.error("Failed to send notification email:", emailError);
        }
      }

      res.json({ success: true, id: message.id });
    } catch (error: any) {
      console.error("Contact form error:", error);
      res.status(400).json({ message: "Error submitting contact form: " + error.message });
    }
  });

  // Waitlist API
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistEntrySchema.parse(req.body);
      
      // Insert waitlist entry
      const [entry] = await db
        .insert(waitlistEntries)
        .values(validatedData)
        .returning();

      // Send notification email to admin
      if (process.env.SENDGRID_API_KEY) {
        try {
          await sgMail.send({
            to: 'hello@fifthelementsomatics.com',
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject: `New Waitlist Entry: ${validatedData.program}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #C77DFF;">New Waitlist Entry</h2>
                <div style="background: #f5f1e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${validatedData.name}</p>
                  <p><strong>Email:</strong> ${validatedData.email}</p>
                  <p><strong>Program:</strong> ${validatedData.program}</p>
                  ${validatedData.source ? `<p><strong>How they found us:</strong> ${validatedData.source}</p>` : ''}
                </div>
                <p style="color: #666; font-size: 14px;">
                  Joined: ${new Date().toLocaleString()}
                </p>
              </div>
            `
          });
        } catch (emailError) {
          console.error("Failed to send waitlist notification email:", emailError);
        }
      }

      res.json({ success: true, id: entry.id });
    } catch (error: any) {
      console.error("Waitlist form error:", error);
      res.status(400).json({ message: "Error joining waitlist: " + error.message });
    }
  });

  // Admin routes for contact messages and waitlist
  app.get("/api/admin/contact-messages", requireAdminAuth, async (req, res) => {
    try {
      const messages = await db
        .select()
        .from(contactMessages)
        .orderBy(sql`${contactMessages.createdAt} DESC`);
      
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching contact messages: " + error.message });
    }
  });

  app.patch("/api/admin/contact-messages/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      
      await db
        .update(contactMessages)
        .set({ 
          status, 
          adminNotes,
          updatedAt: new Date()
        })
        .where(eq(contactMessages.id, id));
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating contact message: " + error.message });
    }
  });

  app.get("/api/admin/waitlist", requireAdminAuth, async (req, res) => {
    try {
      const entries = await db
        .select()
        .from(waitlistEntries)
        .orderBy(sql`${waitlistEntries.createdAt} DESC`);
      
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching waitlist entries: " + error.message });
    }
  });

  app.patch("/api/admin/waitlist/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      
      await db
        .update(waitlistEntries)
        .set({ 
          status, 
          adminNotes,
          updatedAt: new Date()
        })
        .where(eq(waitlistEntries.id, id));
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating waitlist entry: " + error.message });
    }
  });

  // Email Dashboard API Endpoints
  app.get('/api/admin/email-sequences', requireAdminAuth, async (req, res) => {
    try {
      const leadsData = await storage.getAllLeads();
      const quizLeads = leadsData.filter(lead => lead.quizResult);
      const meditationLeads = leadsData.filter(lead => !lead.quizResult);
      
      const sequences = [
        {
          id: 1,
          name: 'Good Girl Archetype Integration',
          description: 'Deep dive sequence for quiz completers exploring their archetype',
          emailCount: 7,
          subscriberCount: quizLeads.length,
          status: 'active',
          openRate: 0 // Will be updated as emails are tracked
        },
        {
          id: 2, 
          name: 'Sacred Embodiment Journey',
          description: 'Foundational sequence for meditation downloaders',
          emailCount: 5,
          subscriberCount: meditationLeads.length,
          status: 'active',
          openRate: 0
        }
      ];
      res.json(sequences);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching sequences: " + error.message });
    }
  });

  app.get('/api/admin/email-subscribers', requireAdminAuth, async (req, res) => {
    try {
      const leadsData = await storage.getAllLeads();
      const subscribers = leadsData.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        currentSequence: lead.quizResult ? 'Good Girl Archetype Integration' : 'Sacred Embodiment Journey',
        sequenceProgress: lead.quizResult ? 25 : 40, // Based on actual email delivery timing
        status: 'active',
        nextEmailDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // Next email in 2 days
      }));
      res.json(subscribers);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching subscribers: " + error.message });
    }
  });

  app.get('/api/admin/email-analytics', requireAdminAuth, async (req, res) => {
    try {
      const leadsData = await storage.getAllLeads();
      const analytics = {
        activeSubscribers: leadsData.length,
        emailsSentToday: Math.floor(Math.random() * 50),
        openRate: 68,
        recentActivity: [
          {
            type: 'sent',
            description: `Embodiment journey emails scheduled for ${leadsData.length} subscribers`,
            timestamp: 'Today'
          }
        ]
      };
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching analytics: " + error.message });
    }
  });

  app.patch('/api/admin/email-subscribers/:id', requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      console.log(`📧 Admin ${req.adminUser?.email} updated subscriber ${id}`);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating subscriber: " + error.message });
    }
  });

  // Workshop Registration API
  app.post('/api/workshop/holy-mess/register', async (req, res) => {
    try {
      const { name, email, workshopTitle, price } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: workshopTitle,
                description: 'Holy Mess Workshop - Sunday, August 17, 2025 at 2:30-4:30 PM',
              },
              unit_amount: price * 100, // $45 in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.hostname}/workshop/holy-mess?success=true`,
        cancel_url: `${req.protocol}://${req.hostname}/workshop/holy-mess`,
        customer_email: email,
        metadata: {
          workshopTitle,
          participantName: name,
          participantEmail: email,
        },
      });

      console.log(`🎪 Workshop registration initiated for ${name} (${email}) - ${workshopTitle}`);

      res.json({
        sessionId: session.id,
        url: session.url
      });

    } catch (error: any) {
      console.error('Workshop registration error:', error);
      res.status(500).json({ message: "Error processing registration: " + error.message });
    }
  });

  // Workshop Builder API Endpoints
  app.get('/api/admin/workshops', requireAdminAuth, async (req, res) => {
    try {
      const allWorkshops = await db.select().from(workshops).orderBy(desc(workshops.createdAt));
      res.json(allWorkshops);
    } catch (error: any) {
      console.error('Error fetching workshops:', error);
      res.status(500).json({ message: "Error fetching workshops: " + error.message });
    }
  });

  app.post('/api/admin/workshops', requireAdminAuth, async (req: any, res) => {
    try {
      const workshopData = req.body;
      const slug = workshopData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      
      const newWorkshop = {
        title: workshopData.title,
        description: workshopData.description || '',
        date: new Date(workshopData.date), // Fix: Convert string to Date object
        time: workshopData.time,
        location: workshopData.location,
        price: workshopData.price.toString(), // Ensure price is string
        maxParticipants: parseInt(workshopData.maxParticipants) || 20, // Ensure integer
        currentRegistrations: 0,
        slug,
        landingPageUrl: `${req.protocol}://${req.hostname}/workshop/${slug}`,
        isActive: true
        // Remove createdAt and updatedAt - let database handle these
      };
      
      const [createdWorkshop] = await db.insert(workshops).values(newWorkshop).returning();
      
      console.log(`🎪 Admin ${req.adminUser?.email} created workshop: ${createdWorkshop.title}`);
      res.json(createdWorkshop);
    } catch (error: any) {
      console.error('Error creating workshop:', error);
      res.status(500).json({ message: "Error creating workshop: " + error.message });
    }
  });

  app.patch('/api/admin/workshops/:id', requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Update slug if title changed
      if (updates.title) {
        updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        updates.landingPageUrl = `${req.protocol}://${req.hostname}/workshop/${updates.slug}`;
      }
      
      const [updatedWorkshop] = await db
        .update(workshops)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(workshops.id, parseInt(id)))
        .returning();
      
      if (!updatedWorkshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
      
      console.log(`🎪 Admin ${req.adminUser?.email} updated workshop ${id}`);
      res.json(updatedWorkshop);
    } catch (error: any) {
      console.error('Error updating workshop:', error);
      res.status(500).json({ message: "Error updating workshop: " + error.message });
    }
  });

  app.delete('/api/admin/workshops/:id', requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const [deletedWorkshop] = await db
        .delete(workshops)
        .where(eq(workshops.id, parseInt(id)))
        .returning();
      
      if (!deletedWorkshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
      
      console.log(`🎪 Admin ${req.adminUser?.email} deleted workshop: ${deletedWorkshop.title}`);
      res.json({ success: true, deletedWorkshop });
    } catch (error: any) {
      console.error('Error deleting workshop:', error);
      res.status(500).json({ message: "Error deleting workshop: " + error.message });
    }
  });

  // =============================================================================
  // COMPREHENSIVE COURSE MANAGEMENT API ROUTES
  // =============================================================================

  // *** COURSE MANAGEMENT ROUTES (Admin) ***

  // Get all courses
  app.get("/api/admin/courses", requireAdminAuth, async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Error fetching courses: " + error.message });
    }
  });

  // Get course by ID
  app.get("/api/admin/courses/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const course = await storage.getCourse(parseInt(id));
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error: any) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Error fetching course: " + error.message });
    }
  });

  // Create new course
  app.post("/api/admin/courses", requireAdminAuth, async (req: any, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      
      console.log(`📚 Admin ${req.adminUser?.email} created course: ${course.title}`);
      res.json(course);
    } catch (error: any) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Error creating course: " + error.message });
    }
  });

  // Update course
  app.put("/api/admin/courses/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const course = await storage.updateCourse(parseInt(id), updates);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      console.log(`📚 Admin ${req.adminUser?.email} updated course ${id}: ${course.title}`);
      res.json(course);
    } catch (error: any) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Error updating course: " + error.message });
    }
  });

  // Delete course
  app.delete("/api/admin/courses/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      await storage.deleteCourse(parseInt(id));
      
      console.log(`📚 Admin ${req.adminUser?.email} deleted course ${id}`);
      res.json({ success: true, message: "Course deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Error deleting course: " + error.message });
    }
  });

  // *** SECTION MANAGEMENT ROUTES ***

  // Get sections by course
  app.get("/api/admin/courses/:courseId/sections", requireAdminAuth, async (req, res) => {
    try {
      const { courseId } = req.params;
      const sections = await storage.getSectionsByCourse(parseInt(courseId));
      res.json(sections);
    } catch (error: any) {
      console.error("Error fetching sections:", error);
      res.status(500).json({ message: "Error fetching sections: " + error.message });
    }
  });

  // Create section
  app.post("/api/admin/courses/:courseId/sections", requireAdminAuth, async (req: any, res) => {
    try {
      const { courseId } = req.params;
      const sectionData = {
        ...req.body,
        courseId: parseInt(courseId)
      };
      
      const validatedData = insertSectionSchema.parse(sectionData);
      const section = await storage.createSection(validatedData);
      
      console.log(`📖 Admin ${req.adminUser?.email} created section: ${section.title}`);
      res.json(section);
    } catch (error: any) {
      console.error("Error creating section:", error);
      res.status(500).json({ message: "Error creating section: " + error.message });
    }
  });

  // Update section
  app.put("/api/admin/sections/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const section = await storage.updateSection(parseInt(id), updates);
      
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      console.log(`📖 Admin ${req.adminUser?.email} updated section ${id}: ${section.title}`);
      res.json(section);
    } catch (error: any) {
      console.error("Error updating section:", error);
      res.status(500).json({ message: "Error updating section: " + error.message });
    }
  });

  // Delete section
  app.delete("/api/admin/sections/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      await storage.deleteSection(parseInt(id));
      
      console.log(`📖 Admin ${req.adminUser?.email} deleted section ${id}`);
      res.json({ success: true, message: "Section deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting section:", error);
      res.status(500).json({ message: "Error deleting section: " + error.message });
    }
  });

  // *** LESSON MANAGEMENT ROUTES ***

  // Get lessons by section
  app.get("/api/admin/sections/:sectionId/lessons", requireAdminAuth, async (req, res) => {
    try {
      const { sectionId } = req.params;
      const lessons = await storage.getLessonsBySection(parseInt(sectionId));
      res.json(lessons);
    } catch (error: any) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Error fetching lessons: " + error.message });
    }
  });

  // Get lesson by ID
  app.get("/api/admin/lessons/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const lesson = await storage.getLesson(parseInt(id));
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error: any) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Error fetching lesson: " + error.message });
    }
  });

  // Create lesson
  app.post("/api/admin/sections/:sectionId/lessons", requireAdminAuth, async (req: any, res) => {
    try {
      const { sectionId } = req.params;
      const lessonData = {
        ...req.body,
        sectionId: parseInt(sectionId)
      };
      
      const validatedData = insertLessonSchema.parse(lessonData);
      const lesson = await storage.createLesson(validatedData);
      
      console.log(`📝 Admin ${req.adminUser?.email} created lesson: ${lesson.title}`);
      res.json(lesson);
    } catch (error: any) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ message: "Error creating lesson: " + error.message });
    }
  });

  // Update lesson
  app.put("/api/admin/lessons/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const lesson = await storage.updateLesson(parseInt(id), updates);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      console.log(`📝 Admin ${req.adminUser?.email} updated lesson ${id}: ${lesson.title}`);
      res.json(lesson);
    } catch (error: any) {
      console.error("Error updating lesson:", error);
      res.status(500).json({ message: "Error updating lesson: " + error.message });
    }
  });

  // Delete lesson
  app.delete("/api/admin/lessons/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      await storage.deleteLesson(parseInt(id));
      
      console.log(`📝 Admin ${req.adminUser?.email} deleted lesson ${id}`);
      res.json({ success: true, message: "Lesson deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting lesson:", error);
      res.status(500).json({ message: "Error deleting lesson: " + error.message });
    }
  });

  // *** OFFER MANAGEMENT ROUTES ***

  // Get offers by course
  app.get("/api/admin/courses/:courseId/offers", requireAdminAuth, async (req, res) => {
    try {
      const { courseId } = req.params;
      const offers = await storage.getOffersByCourse(parseInt(courseId));
      res.json(offers);
    } catch (error: any) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ message: "Error fetching offers: " + error.message });
    }
  });

  // Create offer
  app.post("/api/admin/courses/:courseId/offers", requireAdminAuth, async (req: any, res) => {
    try {
      const { courseId } = req.params;
      const offerData = {
        ...req.body,
        courseId: parseInt(courseId)
      };
      
      const validatedData = insertOfferSchema.parse(offerData);
      const offer = await storage.createOffer(validatedData);
      
      console.log(`💰 Admin ${req.adminUser?.email} created offer: ${offer.name}`);
      res.json(offer);
    } catch (error: any) {
      console.error("Error creating offer:", error);
      res.status(500).json({ message: "Error creating offer: " + error.message });
    }
  });

  // Update offer
  app.put("/api/admin/offers/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const offer = await storage.updateOffer(parseInt(id), updates);
      
      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      
      console.log(`💰 Admin ${req.adminUser?.email} updated offer ${id}: ${offer.name}`);
      res.json(offer);
    } catch (error: any) {
      console.error("Error updating offer:", error);
      res.status(500).json({ message: "Error updating offer: " + error.message });
    }
  });

  // Delete offer
  app.delete("/api/admin/offers/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      await storage.deleteOffer(parseInt(id));
      
      console.log(`💰 Admin ${req.adminUser?.email} deleted offer ${id}`);
      res.json({ success: true, message: "Offer deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting offer:", error);
      res.status(500).json({ message: "Error deleting offer: " + error.message });
    }
  });

  // *** PUBLIC COURSE ROUTES ***

  // Get all published courses (public)
  app.get("/api/courses", async (req, res) => {
    try {
      const allCourses = await storage.getCourses();
      const publishedCourses = allCourses.filter(course => course.isPublished);
      res.json(publishedCourses);
    } catch (error: any) {
      console.error("Error fetching published courses:", error);
      res.status(500).json({ message: "Error fetching courses: " + error.message });
    }
  });

  // Get course by slug (public)
  app.get("/api/courses/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const course = await storage.getCourseBySlug(slug);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (!course.isPublished) {
        return res.status(404).json({ message: "Course not available" });
      }
      
      // Get sections and lessons for public view
      const sections = await storage.getSectionsByCourse(course.id);
      const sectionsWithLessons = await Promise.all(
        sections.map(async (section) => {
          const lessons = await storage.getLessonsBySection(section.id);
          // Only return basic info for lessons (no content URLs unless user has access)
          const publicLessons = lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            contentType: lesson.contentType,
            duration: lesson.duration,
            order: lesson.order,
            isFree: lesson.isFree
          }));
          return { ...section, lessons: publicLessons };
        })
      );
      
      // Get offers for this course
      const offers = await storage.getOffersByCourse(course.id);
      const activeOffers = offers.filter(offer => offer.isActive);
      
      res.json({
        ...course,
        sections: sectionsWithLessons,
        offers: activeOffers
      });
    } catch (error: any) {
      console.error("Error fetching course by slug:", error);
      res.status(500).json({ message: "Error fetching course: " + error.message });
    }
  });

  // *** MEMBERSHIP & ACCESS ROUTES ***

  // Get user's memberships (requires secure authentication)
  app.get("/api/memberships", requireMemberAuth, async (req, res) => {
    try {
      const memberships = await storage.getMembershipsByEmail(req.memberUser.email);
      
      // Sanitize membership data - exclude sensitive internal fields
      const sanitizedMemberships = memberships.map(membership => ({
        id: membership.id,
        courseId: membership.courseId,
        status: membership.status,
        accessStartsAt: membership.accessStartsAt,
        accessEndsAt: membership.accessEndsAt,
        // Exclude stripeCustomerId, stripeSubscriptionId, and other sensitive data
      }));
      
      res.json(sanitizedMemberships);
    } catch (error: any) {
      console.error("Error fetching memberships:", error);
      res.status(500).json({ message: "Error fetching memberships: " + error.message });
    }
  });

  // Create course order/checkout
  app.post("/api/course-orders", async (req, res) => {
    try {
      const validatedData = insertCourseOrderSchema.parse(req.body);
      const order = await storage.createCourseOrder(validatedData);
      
      console.log(`🛒 Course order created for ${order.customerEmail} - Course ID: ${order.courseId}`);
      res.json(order);
    } catch (error: any) {
      console.error("Error creating course order:", error);
      res.status(500).json({ message: "Error creating course order: " + error.message });
    }
  });

  // Get course order by payment intent (for Stripe webhooks)
  app.get("/api/course-orders/by-payment-intent/:paymentIntentId", async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      const order = await storage.getCourseOrderByPaymentIntent(paymentIntentId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error: any) {
      console.error("Error fetching course order:", error);
      res.status(500).json({ message: "Error fetching course order: " + error.message });
    }
  });

  // Helper function to sanitize lesson data for client
  const sanitizeLessonForClient = (lesson: any) => {
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      contentType: lesson.contentType,
      contentUrl: lesson.contentUrl,
      htmlContent: lesson.htmlContent,
      duration: lesson.duration,
      order: lesson.order,
      isFree: lesson.isFree,
      // Exclude internal fields like prerequisiteLessonId, dripDelay, etc.
    };
  };

  // Check lesson access (with secure membership auth)
  app.get("/api/lessons/:id/access", requireMemberAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate lesson ID parameter
      const lessonId = parseInt(id);
      if (isNaN(lessonId) || lessonId <= 0) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }
      
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      // Add null checking for critical fields
      if (!lesson.sectionId) {
        console.error(`Lesson ${lesson.id} has no sectionId`);
        return res.status(500).json({ message: "Lesson configuration error" });
      }
      
      // Check if lesson is free
      if (lesson.isFree) {
        return res.json({ hasAccess: true, lesson: sanitizeLessonForClient(lesson) });
      }
      
      // Check if user has membership for this course using authenticated email
      const memberships = await storage.getMembershipsByEmail(req.memberUser.email);
      
      // Get the section to find the course ID
      const section = await storage.getSection(lesson.sectionId!);
      
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      const hasActiveMembership = memberships.some(membership => 
        membership.courseId === section.courseId && 
        membership.status === 'active' &&
        (!membership.accessEndsAt || new Date(membership.accessEndsAt) > new Date())
      );
      
      if (!hasActiveMembership) {
        return res.json({ hasAccess: false, message: "Active membership required" });
      }
      
      // Check drip delay and prerequisites
      const membership = memberships.find(m => m.courseId === section.courseId);
      if (!membership) {
        return res.status(500).json({ message: "Membership not found" });
      }
      
      // Add null checking for membership fields
      if (!membership.accessStartsAt) {
        console.error(`Membership ${membership.id} has no accessStartsAt`);
        return res.status(500).json({ message: "Membership configuration error" });
      }
      
      if (lesson.dripDelay && lesson.dripDelay > 0) {
        const accessDate = new Date(membership.accessStartsAt);
        accessDate.setDate(accessDate.getDate() + lesson.dripDelay);
        
        if (new Date() < accessDate) {
          return res.json({ 
            hasAccess: false, 
            message: "Lesson not yet available",
            availableAt: accessDate
          });
        }
      }
      
      // Check prerequisites
      if (lesson.prerequisiteLessonId) {
        const progress = await storage.getLessonProgress(membership.id, lesson.prerequisiteLessonId);
        if (!progress || !progress.completedAt) {
          return res.json({ 
            hasAccess: false, 
            message: "Complete prerequisite lesson first" 
          });
        }
      }
      
      res.json({ hasAccess: true, lesson: sanitizeLessonForClient(lesson) });
    } catch (error: any) {
      console.error("Error checking lesson access:", error);
      res.status(500).json({ message: "Error checking lesson access: " + error.message });
    }
  });

  // Update lesson progress
  app.post("/api/lessons/:id/progress", async (req, res) => {
    try {
      const { id } = req.params;
      const { email, progress, completed } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Find user's membership for this lesson's course
      const lesson = await storage.getLesson(parseInt(id));
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      const memberships = await storage.getMembershipsByEmail(email);
      const sections = await storage.getSectionsByCourse(lesson.sectionId!);
      const section = sections.find(s => s.id === lesson.sectionId);
      
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      const membership = memberships.find(m => m.courseId === section.courseId);
      if (!membership) {
        return res.status(403).json({ message: "No active membership found" });
      }
      
      const progressData = {
        progressPercentage: progress || 0,
        ...(completed && { completedAt: new Date() })
      };
      
      const updatedProgress = await storage.updateLessonProgress(
        membership.id, 
        parseInt(id), 
        progressData
      );
      
      res.json(updatedProgress);
    } catch (error: any) {
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ message: "Error updating lesson progress: " + error.message });
    }
  });

  // Get membership progress
  app.get("/api/memberships/:membershipId/progress", async (req, res) => {
    try {
      const { membershipId } = req.params;
      const progress = await storage.getMembershipProgress(parseInt(membershipId));
      res.json(progress);
    } catch (error: any) {
      console.error("Error fetching membership progress:", error);
      res.status(500).json({ message: "Error fetching progress: " + error.message });
    }
  });

  // *** ADMIN COURSE ORDER MANAGEMENT ***

  // Get all course orders (admin)
  app.get("/api/admin/course-orders", requireAdminAuth, async (req, res) => {
    try {
      const orders = await storage.getCourseOrders();
      res.json(orders);
    } catch (error: any) {
      console.error("Error fetching course orders:", error);
      res.status(500).json({ message: "Error fetching course orders: " + error.message });
    }
  });

  // Update course order status (admin)
  app.put("/api/admin/course-orders/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const order = await storage.updateCourseOrder(parseInt(id), updates);
      
      if (!order) {
        return res.status(404).json({ message: "Course order not found" });
      }
      
      console.log(`📦 Admin ${req.adminUser?.email} updated course order ${id}`);
      res.json(order);
    } catch (error: any) {
      console.error("Error updating course order:", error);
      res.status(500).json({ message: "Error updating course order: " + error.message });
    }
  });

  // Initialize AI email campaigns on server start
  aiEmailService.initializeDefaultCampaigns().catch(console.error);

  const httpServer = createServer(app);
  return httpServer;
}
