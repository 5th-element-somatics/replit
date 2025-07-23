import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  amount: integer("amount").notNull(), // amount in cents
  hasReturnToBodyAddon: boolean("has_return_to_body_addon").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  experience: text("experience").notNull(),
  intentions: text("intentions").notNull(),
  challenges: text("challenges").notNull(),
  support: text("support").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  source: text("source").notNull().default("meditation-download"),
  quizResult: text("quiz_result"),
  quizAnswers: text("quiz_answers"), // JSON string of quiz answers
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).pick({
  email: true,
  stripePaymentIntentId: true,
  amount: true,
  hasReturnToBodyAddon: true,
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  name: true,
  email: true,
  phone: true,
  experience: true,
  intentions: true,
  challenges: true,
  support: true,
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  email: true,
  name: true,
  source: true,
  quizResult: true,
  quizAnswers: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
