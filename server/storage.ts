import { users, purchases, applications, leads, magicLinks, adminSessions, type User, type InsertUser, type Purchase, type InsertPurchase, type Application, type InsertApplication, type Lead, type InsertLead, type MagicLink, type InsertMagicLink, type AdminSession, type InsertAdminSession } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
