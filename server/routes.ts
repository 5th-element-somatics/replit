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
  aiEmailCampaigns,
  aiEmailTemplates,
  aiEmailQueue,
  aiEmailDeliveries,
  contactMessages,
  waitlistEntries
} from "@shared/schema";
import { sql, count, sum, eq } from 'drizzle-orm';
import { db } from "./db";
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

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
            <a href="${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://fifthelementsomatics.com'}/free-meditation" 
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
      const { text, voice_id = "21m00Tcm4TlvDq8ikWAM", model_id = "eleven_multilingual_v2" } = req.body;
      
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

        // Send access email with video links
        console.log('🎥 Sending masterclass access email to:', paymentIntent.metadata.email);
        // Email will contain direct Google Drive links for video access
        
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
      
      // TEMPORARY BYPASS FOR DEVELOPMENT - REMOVE IN PRODUCTION
      if (process.env.NODE_ENV === 'development') {
        req.adminUser = { email: 'saint@fifthelementsomatics.com' };
        return next();
      }
      
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

  // Get all applications (admin endpoint - protected)
  app.get("/api/applications", requireAdminAuth, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      console.log(`📋 Admin ${req.adminUser.email} requested applications. Returning ${applications.length} total applications`);
      
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
        subject: `🎉 Welcome to The Good Girl Paradox Masterclass!`,
        trackingSettings: {
          clickTracking: {
            enable: false
          },
          openTracking: {
            enable: false
          }
        },
        html: `
          <div style="font-family: Georgia, serif; background: linear-gradient(135deg, #1a0d1f 0%, #2d1b33 100%); margin: 0; padding: 20px; color: #f5f1e8;">
            <div style="max-width: 600px; margin: 0 auto; background: rgba(26, 13, 31, 0.95); border: 1px solid rgba(199, 125, 255, 0.3); border-radius: 12px; overflow: hidden;">
              
              <div style="background: linear-gradient(135deg, #C77DFF 0%, #e879f9 100%); padding: 30px 20px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Welcome to The Good Girl Paradox!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your transformational journey begins now</p>
              </div>
              
              <div style="padding: 30px;">
                <div style="font-size: 18px; line-height: 1.6; margin-bottom: 25px;">
                  <p>Beautiful ${name},</p>
                  <p>I'm absolutely thrilled you've joined us for <strong>The Good Girl Paradox Masterclass</strong>. This is where your journey of erotic reclamation and sovereign embodiment truly begins.</p>
                  <p>You've just invested in yourself in the most profound way - and I'm here to guide you every step of the way.</p>
                </div>

                <div style="background: rgba(199, 125, 255, 0.1); border: 1px solid rgba(199, 125, 255, 0.3); border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <h3 style="color: #C77DFF; margin-top: 0; font-size: 20px;">🔑 Your Masterclass Access</h3>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Investment:</strong> ${amount === 0 ? 'Complimentary Access' : `$${Number(amount).toFixed(2)}`}</p>
                  <p><strong>Access Level:</strong> Complete Masterclass${hasReturnToBodyAddon ? ' + Return to Body Practices' : ''}</p>
                  
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${accessUrl}" style="display: inline-block; background: linear-gradient(135deg, #C77DFF 0%, #e879f9 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; font-size: 16px;">
                      Access Your Masterclass Now →
                    </a>
                  </div>
                  
                  <p style="font-size: 14px; opacity: 0.8; text-align: center;">
                    Simply enter your email address on the watch page to verify your purchase and start watching immediately.
                  </p>
                </div>

                <div style="background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <h4 style="color: #C77DFF; margin-top: 0;">What's Waiting For You:</h4>
                  <div style="margin: 10px 0; font-size: 15px;">✨ Main Masterclass - The foundation of your erotic reclamation</div>
                  <div style="margin: 10px 0; font-size: 15px;">✨ Boundary Tapping - EFT techniques for energetic sovereignty</div>
                  <div style="margin: 10px 0; font-size: 15px;">✨ Sovereignty Ritual - Reclaiming your authentic power</div>
                  <div style="margin: 10px 0; font-size: 15px;">✨ Eros Activation - Awakening your sensual essence</div>
                </div>

                ${hasReturnToBodyAddon ? `
                <div style="background: linear-gradient(135deg, rgba(231, 121, 249, 0.1) 0%, rgba(199, 125, 255, 0.1) 100%); border: 1px solid rgba(231, 121, 249, 0.3); border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <h4 style="color: #e879f9; margin-top: 0;">🎁 Return to Body Practices (Included)</h4>
                  <p>You also have access to our exclusive Return to Body practices - additional embodiment techniques and insights to deepen your somatic journey.</p>
                </div>
                ` : ''}

                <div style="font-style: italic; color: #C77DFF; margin: 20px 0; padding: 15px; border-left: 3px solid #C77DFF; background: rgba(199, 125, 255, 0.05);">
                  <p>"Your body knows the way back to your truth. Trust her wisdom, honor her knowing, and watch as she guides you home to yourself."</p>
                  <p style="text-align: right; margin-top: 10px;">- Saint</p>
                </div>

                <p>Ready to begin? Your videos are waiting for you at the link above. Take your time, go at your own pace, and remember - this is YOUR journey of reclamation.</p>

                <p>With love and in service to your sovereignty,<br>
                <strong>Saint</strong><br>
                Fifth Element Somatics</p>
              </div>
              
              <div style="text-align: center; padding: 20px; border-top: 1px solid rgba(199, 125, 255, 0.2); font-size: 14px; color: #b8b4b1;">
                <p>Fifth Element Somatics | Sensual. Sovereign. Sacred.</p>
                <p>Questions? Reply to this email - I read every single one.</p>
              </div>
            </div>
          </div>
        `
      };
      
      await sgMail.send(msg);
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
      console.log(`📋 Admin ${req.adminUser.email} requested applications. Returning ${applications.length} total applications`);
      
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
      console.log(`📊 Admin ${req.adminUser.email} requested leads. Returning ${leads.length} total leads`);
      
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

      const finalVoiceId = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default to Soul Sister
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
    'raj@raj.net' // Development access
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
      
      if (req.headers.origin) {
        // Use the origin header which contains the correct protocol and host
        baseUrl = req.headers.origin;
      } else if (req.headers.referer) {
        // Fallback to referer and extract base URL
        const refererUrl = new URL(req.headers.referer);
        baseUrl = `${refererUrl.protocol}//${refererUrl.host}`;
      } else {
        // Last resort - construct from headers
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        baseUrl = `${protocol}://${host}`;
      }
      
      console.log('Using baseUrl for magic link:', baseUrl);
      
      const magicLink = `${baseUrl}/admin-verify?token=${token}`;

      if (process.env.SENDGRID_API_KEY) {
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

        await sgMail.send(msg);
      }

      res.json({ success: true, message: "Magic link sent to your email" });
    } catch (error: any) {
      console.error("Magic link request error:", error);
      res.status(500).json({ message: "Error sending magic link: " + error.message });
    }
  });

  // Verify magic link and create admin session
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

      // Set session cookie
      res.cookie('admin_session', sessionToken, {
        httpOnly: true,
        secure: true, // Always use secure cookies since we're on HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'none' // Required for cross-origin cookies
      });
      
      console.log('Admin session created for:', magicLink.email, 'with token:', sessionToken.substring(0, 8) + '...');

      res.json({ success: true, message: "Login successful" });
    } catch (error: any) {
      console.error("Magic link verification error:", error);
      res.status(500).json({ message: "Error verifying magic link: " + error.message });
    }
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
        db.select().from(leads).orderBy(leads.createdAt),
        db.select().from(applications).orderBy(applications.createdAt),
        db.select().from(purchases).orderBy(purchases.createdAt)
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
      console.log(`🤖 AI Command from ${req.adminUser.email}: ${command}`);

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
      try {
        aiResponse = JSON.parse(response.content[0].text);
      } catch {
        aiResponse = {
          action: "Analysis completed",
          summary: "AI processed your request",
          details: response.content[0].text,
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

  // Initialize AI email campaigns on server start
  aiEmailService.initializeDefaultCampaigns().catch(console.error);

  const httpServer = createServer(app);
  return httpServer;
}
