import { 
  users, 
  purchases, 
  applications, 
  leads, 
  magicLinks, 
  adminSessions,
  contentPages,
  emailSequences,
  pageViews,
  conversionEvents,
  affiliates,
  customerTags,
  leadNotes,
  leadStatus,
  type User, 
  type InsertUser, 
  type Purchase, 
  type InsertPurchase, 
  type Application, 
  type InsertApplication, 
  type Lead, 
  type InsertLead, 
  type MagicLink, 
  type InsertMagicLink, 
  type AdminSession, 
  type InsertAdminSession 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sum } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getPurchaseByPaymentIntent(paymentIntentId: string): Promise<Purchase | undefined>;
  getPurchaseByEmail(email: string): Promise<Purchase | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  getAllApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  // Magic link authentication methods
  createMagicLink(magicLink: InsertMagicLink): Promise<MagicLink>;
  getMagicLink(token: string): Promise<MagicLink | undefined>;
  useMagicLink(token: string): Promise<void>;
  // Admin session methods
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  getAdminSession(sessionToken: string): Promise<AdminSession | undefined>;
  deleteAdminSession(sessionToken: string): Promise<void>;
  
  // Application CRUD
  updateApplication(id: number, updates: Partial<Application>): Promise<Application>;
  deleteApplication(id: number): Promise<void>;
  
  // Lead CRUD
  updateLead(id: number, updates: Partial<Lead>): Promise<Lead>;
  deleteLead(id: number): Promise<void>;
  
  // Admin settings
  getSystemSettings(): Promise<any>;
  updateSystemSettings(settings: any): Promise<any>;
  // Advanced admin methods
  getAnalytics(): Promise<any>;
  getAffiliates(): Promise<any[]>;
  createAffiliate(data: any): Promise<any>;
  getEmailSequences(): Promise<any[]>;
  createEmailSequence(data: any): Promise<any>;
  getContentPages(): Promise<any[]>;
  createContentPage(data: any): Promise<any>;
  trackConversion(data: any): Promise<void>;
  trackPageView(data: any): Promise<void>;
  addLeadNote(data: any): Promise<any>;
  updateLeadStatus(data: any): Promise<any>;
  getCustomerTags(): Promise<any[]>;
  createCustomerTag(data: any): Promise<any>;
  assignCustomerTag(data: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values(insertPurchase)
      .returning();
    return purchase;
  }

  async getPurchaseByPaymentIntent(paymentIntentId: string): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.stripePaymentIntentId, paymentIntentId));
    return purchase || undefined;
  }

  async getPurchaseByEmail(email: string): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.email, email));
    return purchase || undefined;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getAllApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.createdAt));
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  // Magic link authentication methods
  async createMagicLink(insertMagicLink: InsertMagicLink): Promise<MagicLink> {
    const [magicLink] = await db
      .insert(magicLinks)
      .values(insertMagicLink)
      .returning();
    return magicLink;
  }

  async getMagicLink(token: string): Promise<MagicLink | undefined> {
    const [magicLink] = await db.select().from(magicLinks).where(eq(magicLinks.token, token));
    return magicLink || undefined;
  }

  async useMagicLink(token: string): Promise<void> {
    await db
      .update(magicLinks)
      .set({ used: true })
      .where(eq(magicLinks.token, token));
  }

  // Admin session methods
  async createAdminSession(insertAdminSession: InsertAdminSession): Promise<AdminSession> {
    const [adminSession] = await db
      .insert(adminSessions)
      .values(insertAdminSession)
      .returning();
    return adminSession;
  }

  async getAdminSession(sessionToken: string): Promise<AdminSession | undefined> {
    const [adminSession] = await db.select().from(adminSessions).where(eq(adminSessions.sessionToken, sessionToken));
    return adminSession || undefined;
  }

  async deleteAdminSession(sessionToken: string): Promise<void> {
    await db
      .delete(adminSessions)
      .where(eq(adminSessions.sessionToken, sessionToken));
  }

  // Application CRUD operations
  async updateApplication(id: number, updates: Partial<Application>): Promise<Application> {
    const [updated] = await db
      .update(applications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updated;
  }

  async deleteApplication(id: number): Promise<void> {
    await db.delete(applications).where(eq(applications.id, id));
  }

  // Lead CRUD operations
  async updateLead(id: number, updates: Partial<Lead>): Promise<Lead> {
    const [updated] = await db
      .update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return updated;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  // System settings
  async getSystemSettings(): Promise<any> {
    return {
      emailProcessingEnabled: false,
      autoEmailSequenceEnabled: true,
      quizEmailsEnabled: true,
      sendgridConfigured: !!process.env.SENDGRID_API_KEY,
      elevenLabsConfigured: !!process.env.ELEVEN_LABS_API_KEY,
      anthropicConfigured: !!process.env.ANTHROPIC_API_KEY,
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      maxDailyEmails: 100,
      sessionTimeout: 15, // minutes
      authorizedEmails: [
        'hello@fifthelementsomatics.com',
        'saint@fifthelementsomatics.com',
        'raj@raj.net'
      ]
    };
  }

  async updateSystemSettings(settings: any): Promise<any> {
    // In a real app, this would update a settings table
    console.log('📝 System settings update requested:', settings);
    return settings;
  }

  // Advanced admin methods
  async getAnalytics(): Promise<any> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Basic counts and revenue
    const [totalPurchases] = await db.select({ count: count() }).from(purchases);
    const [totalLeads] = await db.select({ count: count() }).from(leads);
    const [totalRevenue] = await db.select({ 
      total: sum(purchases.amount) 
    }).from(purchases);

    return {
      totalRevenue: Number(totalRevenue?.total || 0) / 100, // Convert from cents
      revenueGrowth: 12, // Mock growth percentage
      activeLeads: totalLeads.count,
      leadGrowth: 8,
      conversionRate: 4.2,
      conversionGrowth: 2.1,
      affiliateCommissions: 0,
      activeAffiliates: 0,
      pageViews: totalPurchases.count * 10, // Mock multiplier
      quizCompletions: totalLeads.count * 0.8,
      emailCaptures: totalLeads.count,
      purchases: totalPurchases.count,
      topSources: [
        { name: "Direct", count: 45, percentage: 35 },
        { name: "Social Media", count: 38, percentage: 30 },
        { name: "Referral", count: 25, percentage: 20 },
        { name: "Search", count: 19, percentage: 15 }
      ]
    };
  }

  async getAffiliates(): Promise<any[]> {
    return await db.select().from(affiliates).orderBy(desc(affiliates.createdAt));
  }

  async createAffiliate(data: any): Promise<any> {
    const [affiliate] = await db
      .insert(affiliates)
      .values(data)
      .returning();
    return affiliate;
  }

  async getEmailSequences(): Promise<any[]> {
    return await db.select().from(emailSequences).orderBy(desc(emailSequences.createdAt));
  }

  async createEmailSequence(data: any): Promise<any> {
    const [sequence] = await db
      .insert(emailSequences)
      .values(data)
      .returning();
    return sequence;
  }

  async getContentPages(): Promise<any[]> {
    return await db.select().from(contentPages).orderBy(desc(contentPages.createdAt));
  }

  async createContentPage(data: any): Promise<any> {
    const [page] = await db
      .insert(contentPages)
      .values(data)
      .returning();
    return page;
  }

  async trackConversion(data: any): Promise<void> {
    await db.insert(conversionEvents).values(data);
  }

  async trackPageView(data: any): Promise<void> {
    await db.insert(pageViews).values(data);
  }

  async addLeadNote(data: any): Promise<any> {
    const [note] = await db
      .insert(leadNotes)
      .values(data)
      .returning();
    return note;
  }

  async updateLeadStatus(data: any): Promise<any> {
    const [statusEntry] = await db
      .insert(leadStatus)
      .values(data)
      .returning();
    return statusEntry;
  }

  async getCustomerTags(): Promise<any[]> {
    return await db.select().from(customerTags).orderBy(desc(customerTags.createdAt));
  }

  async createCustomerTag(data: any): Promise<any> {
    const [tag] = await db
      .insert(customerTags)
      .values(data)
      .returning();
    return tag;
  }

  async assignCustomerTag(data: any): Promise<any> {
    // This would normally use customerTagAssignments table
    return { success: true };
  }
}

export const storage = new DatabaseStorage();
