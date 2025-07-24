import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertPurchaseSchema, insertApplicationSchema, insertLeadSchema } from "@shared/schema";
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
      
      if (!sessionToken) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const session = await storage.getAdminSession(sessionToken);
      
      if (!session) {
        return res.status(401).json({ message: "Invalid session" });
      }

      if (new Date() > session.expiresAt) {
        await storage.deleteAdminSession(sessionToken);
        return res.status(401).json({ message: "Session expired" });
      }

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
      
      res.json({ success: true, id: lead.id });
    } catch (error: any) {
      res.status(400).json({ message: "Error submitting lead: " + error.message });
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

  // Get all leads (admin endpoint - protected)
  app.get("/api/leads", requireAdminAuth, async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
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

      // Send magic link email - use the current request's origin
      console.log('Request headers for magic link:', {
        'x-forwarded-proto': req.headers['x-forwarded-proto'],
        'x-forwarded-host': req.headers['x-forwarded-host'],
        'host': req.headers.host,
        'protocol': req.protocol,
        'origin': req.headers.origin,
        'referer': req.headers.referer
      });
      
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      const baseUrl = `${protocol}://${host}`;
      
      console.log('Generated baseUrl:', baseUrl);
      
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
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
      });

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

  const httpServer = createServer(app);
  return httpServer;
}
