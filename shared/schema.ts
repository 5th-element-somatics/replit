import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, decimal, date, real } from "drizzle-orm/pg-core";
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
  experience: text("experience").notNull(),
  whatDrawsYou: text("what_draws_you").notNull(),
  hopeToExplore: text("hope_to_explore").notNull(),
  challenges: text("challenges").notNull(),
  support: text("support").notNull(),
  longToExperience: text("long_to_experience").notNull(),
  afraidToExpress: text("afraid_to_express").notNull(),
  desireFromGuide: text("desire_from_guide").notNull(),
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

export const magicLinks = pgTable("magic_links", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memberSessions = pgTable("member_sessions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CMS Content Management
export const contentPages = pgTable("content_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Rich text content
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mediaLibrary = pgTable("media_library", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email Marketing & Nurture Sequences
export const emailSequences = pgTable("email_sequences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  triggerType: text("trigger_type").notNull(), // 'quiz_result', 'lead_source', 'purchase', 'manual'
  triggerValue: text("trigger_value"), // specific quiz result, source name, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  sequenceId: integer("sequence_id").references(() => emailSequences.id),
  stepNumber: integer("step_number").notNull(),
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  delayDays: integer("delay_days").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailDeliveries = pgTable("email_deliveries", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => emailTemplates.id),
  recipientEmail: text("recipient_email").notNull(),
  recipientName: text("recipient_name"),
  status: text("status").notNull(), // 'queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics & Tracking
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  sessionId: text("session_id"),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export const conversionEvents = pgTable("conversion_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // 'quiz_completed', 'email_captured', 'purchase', 'application_submitted'
  eventValue: decimal("event_value", { precision: 10, scale: 2 }),
  userEmail: text("user_email"),
  metadata: jsonb("metadata"), // Additional event data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Affiliate Management
export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.3000"), // 30% default
  paypalEmail: text("paypal_email"),
  isActive: boolean("is_active").default(true),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const affiliateClicks = pgTable("affiliate_clicks", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").references(() => affiliates.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  landingPage: text("landing_page").notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
});

export const affiliateCommissions = pgTable("affiliate_commissions", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").references(() => affiliates.id),
  purchaseId: integer("purchase_id").references(() => purchases.id),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'paid'
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Customer Segmentation & Tags
export const customerTags = pgTable("customer_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#6B7280"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customerTagAssignments = pgTable("customer_tag_assignments", {
  id: serial("id").primaryKey(),
  customerEmail: text("customer_email").notNull(),
  tagId: integer("tag_id").references(() => customerTags.id),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

// Advanced Lead Management
export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  note: text("note").notNull(),
  adminEmail: text("admin_email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leadStatus = pgTable("lead_status", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  status: text("status").notNull(), // 'new', 'contacted', 'qualified', 'converted', 'lost'
  changedBy: text("changed_by").notNull(),
  changedAt: timestamp("changed_at").defaultNow().notNull(),
});

// AI Email Marketing Automation Tables
export const aiEmailCampaigns = pgTable("ai_email_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  triggerType: text("trigger_type").notNull(), // quiz_completion, meditation_download, manual, time_delay
  triggerData: jsonb("trigger_data"), // Additional trigger criteria
  targetAudience: text("target_audience").notNull(), // all, quiz_takers, meditation_downloaders, specific_archetype
  audienceFilters: jsonb("audience_filters"), // Additional filtering criteria
  isActive: boolean("is_active").default(true),
  aiPersonalization: boolean("ai_personalization").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiEmailTemplates = pgTable("ai_email_templates", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => aiEmailCampaigns.id),
  name: text("name").notNull(),
  subjectTemplate: text("subject_template").notNull(), // Can include {{name}}, {{archetype}} placeholders
  bodyTemplate: text("body_template").notNull(), // Rich text with AI placeholders
  aiPromptInstructions: text("ai_prompt_instructions"), // Instructions for AI personalization
  sendDelay: integer("send_delay").default(0), // Minutes after trigger
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0), // Order in sequence
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiEmailQueue = pgTable("ai_email_queue", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  templateId: integer("template_id").references(() => aiEmailTemplates.id),
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, sent, failed, cancelled
  personalizedSubject: text("personalized_subject"),
  personalizedBody: text("personalized_body"),
  aiGenerationData: jsonb("ai_generation_data"), // Store AI context used
  sentAt: timestamp("sent_at"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiEmailDeliveries = pgTable("ai_email_deliveries", {
  id: serial("id").primaryKey(),
  queueId: integer("queue_id").references(() => aiEmailQueue.id),
  leadId: integer("lead_id").references(() => leads.id),
  templateId: integer("template_id").references(() => aiEmailTemplates.id),
  subject: text("subject").notNull(),
  bodyHtml: text("body_html").notNull(),
  bodyText: text("body_text"),
  deliveryStatus: text("delivery_status").default("sent"), // sent, bounced, opened, clicked
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  linkClicked: text("link_clicked"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const aiEmailSettings = pgTable("ai_email_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leadBehaviorTracking = pgTable("lead_behavior_tracking", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  eventType: text("event_type").notNull(), // page_view, email_open, email_click, quiz_retake, meditation_play
  eventData: jsonb("event_data"), // Additional event context
  eventTimestamp: timestamp("event_timestamp").defaultNow().notNull(),
});

// Contact Messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, read, replied, archived
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Waitlist Management
export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  program: text("program").notNull().default("radiant-alchemy"), // radiant-alchemy, masterclass, mentorship
  source: text("source"), // how_found_us
  status: text("status").notNull().default("active"), // active, contacted, converted, unsubscribed
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
  whatDrawsYou: true,
  hopeToExplore: true,
  challenges: true,
  support: true,
  longToExperience: true,
  afraidToExpress: true,
  desireFromGuide: true,
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  email: true,
  name: true,
  source: true,
  quizResult: true,
  quizAnswers: true,
});

export const insertMagicLinkSchema = createInsertSchema(magicLinks).pick({
  email: true,
  token: true,
  expiresAt: true,
});

export const insertAdminSessionSchema = createInsertSchema(adminSessions).pick({
  email: true,
  sessionToken: true,
  expiresAt: true,
});

export const insertMemberSessionSchema = createInsertSchema(memberSessions).pick({
  email: true,
  sessionToken: true,
  expiresAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  message: true,
});

export const insertWaitlistEntrySchema = createInsertSchema(waitlistEntries).pick({
  name: true,
  email: true,
  program: true,
  source: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertMagicLink = z.infer<typeof insertMagicLinkSchema>;
export type MagicLink = typeof magicLinks.$inferSelect;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertMemberSession = z.infer<typeof insertMemberSessionSchema>;
export type MemberSession = typeof memberSessions.$inferSelect;

// New advanced types
export type ContentPage = typeof contentPages.$inferSelect;
export type EmailSequence = typeof emailSequences.$inferSelect;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type EmailDelivery = typeof emailDeliveries.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
export type Affiliate = typeof affiliates.$inferSelect;
export type AffiliateClick = typeof affiliateClicks.$inferSelect;
export type AffiliateCommission = typeof affiliateCommissions.$inferSelect;
export type CustomerTag = typeof customerTags.$inferSelect;
export type LeadNote = typeof leadNotes.$inferSelect;
export type LeadStatusEntry = typeof leadStatus.$inferSelect;

// AI Email Marketing Types
export type AiEmailCampaign = typeof aiEmailCampaigns.$inferSelect;
export type InsertAiEmailCampaign = typeof aiEmailCampaigns.$inferInsert;
export type AiEmailTemplate = typeof aiEmailTemplates.$inferSelect;
export type InsertAiEmailTemplate = typeof aiEmailTemplates.$inferInsert;
export type AiEmailQueue = typeof aiEmailQueue.$inferSelect;
export type InsertAiEmailQueue = typeof aiEmailQueue.$inferInsert;
export type AiEmailDelivery = typeof aiEmailDeliveries.$inferSelect;
export type InsertAiEmailDelivery = typeof aiEmailDeliveries.$inferInsert;
export type AiEmailSetting = typeof aiEmailSettings.$inferSelect;
export type InsertAiEmailSetting = typeof aiEmailSettings.$inferInsert;
export type LeadBehaviorTracking = typeof leadBehaviorTracking.$inferSelect;
export type InsertLeadBehaviorTracking = typeof leadBehaviorTracking.$inferInsert;

// Contact and Waitlist Types
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistEntrySchema>;

// Admin-created workshops table
export const workshops = pgTable("workshops", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  maxParticipants: integer("max_participants").default(20),
  currentRegistrations: integer("current_registrations").default(0),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  landingPageUrl: text("landing_page_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Workshop registrations table
export const workshopRegistrations = pgTable("workshop_registrations", {
  id: serial("id").primaryKey(),
  workshopId: integer("workshop_id").references(() => workshops.id),
  workshopTitle: varchar("workshop_title").notNull(),
  participantName: varchar("participant_name").notNull(),
  participantEmail: varchar("participant_email").notNull(),
  stripeSessionId: varchar("stripe_session_id"),
  paymentStatus: varchar("payment_status").default('pending'),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }),
  registrationDate: timestamp("registration_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkshopSchema = createInsertSchema(workshops).pick({
  title: true,
  description: true,
  date: true,
  time: true,
  location: true,
  price: true,
  maxParticipants: true,
  slug: true,
  isActive: true,
});

export const insertWorkshopRegistrationSchema = createInsertSchema(workshopRegistrations).pick({
  workshopId: true,
  workshopTitle: true,
  participantName: true,
  participantEmail: true,
  stripeSessionId: true,
  paymentStatus: true,
  amountPaid: true,
});

export type Workshop = typeof workshops.$inferSelect;
export type InsertWorkshop = z.infer<typeof insertWorkshopSchema>;
export type WorkshopRegistration = typeof workshopRegistrations.$inferSelect;
export type InsertWorkshopRegistration = z.infer<typeof insertWorkshopRegistrationSchema>;

// Course & Membership System (Kajabi-style)
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  thumbnail: text("thumbnail"), // URL to course image
  isPublished: boolean("is_published").default(false),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }), // For showing discounts
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").references(() => sections.id),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(), // 'video', 'audio', 'text', 'download'
  contentUrl: text("content_url"), // URL to video/audio/download file
  htmlContent: text("html_content"), // Rich text content for text lessons
  duration: integer("duration"), // In seconds for video/audio
  order: integer("order").notNull().default(0),
  isPublished: boolean("is_published").default(true),
  isFree: boolean("is_free").default(false), // Preview lessons
  dripDelay: integer("drip_delay").default(0), // Days after purchase before available
  prerequisiteLessonId: integer("prerequisite_lesson_id"), // Must complete this lesson first
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  name: text("name").notNull(),
  description: text("description"),
  priceType: text("price_type").notNull(), // 'one_time', 'subscription', 'payment_plan'
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  interval: text("interval"), // For subscriptions: 'monthly', 'yearly'
  paymentPlanInstallments: integer("payment_plan_installments"), // For payment plans
  paymentPlanInterval: text("payment_plan_interval"), // 'weekly', 'monthly'
  stripePriceId: text("stripe_price_id"), // Stripe Price ID for this offer
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  courseId: integer("course_id").references(() => courses.id),
  offerId: integer("offer_id").references(() => offers.id),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"), // For subscriptions
  status: text("status").notNull().default("active"), // 'active', 'cancelled', 'expired', 'trial'
  accessStartsAt: timestamp("access_starts_at").defaultNow().notNull(),
  accessEndsAt: timestamp("access_ends_at"), // Null for lifetime access
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  membershipId: integer("membership_id").references(() => memberships.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  isCompleted: boolean("is_completed").default(false),
  watchTime: integer("watch_time").default(0), // Seconds watched for videos
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courseOrders = pgTable("course_orders", {
  id: serial("id").primaryKey(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  courseId: integer("course_id").references(() => courses.id),
  offerId: integer("offer_id").references(() => offers.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  stripeSessionId: text("stripe_session_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed', 'refunded'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas for new tables
export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  slug: true,
  thumbnail: true,
  isPublished: true,
  price: true,
  compareAtPrice: true,
});

export const insertSectionSchema = createInsertSchema(sections).pick({
  courseId: true,
  title: true,
  description: true,
  order: true,
  isPublished: true,
});

export const insertLessonSchema = createInsertSchema(lessons).pick({
  sectionId: true,
  title: true,
  description: true,
  contentType: true,
  contentUrl: true,
  htmlContent: true,
  duration: true,
  order: true,
  isPublished: true,
  isFree: true,
  dripDelay: true,
  prerequisiteLessonId: true,
});

export const insertOfferSchema = createInsertSchema(offers).pick({
  courseId: true,
  name: true,
  description: true,
  priceType: true,
  price: true,
  compareAtPrice: true,
  interval: true,
  paymentPlanInstallments: true,
  paymentPlanInterval: true,
  stripePriceId: true,
  isActive: true,
});

export const insertMembershipSchema = createInsertSchema(memberships).pick({
  customerEmail: true,
  customerName: true,
  courseId: true,
  offerId: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  status: true,
  accessStartsAt: true,
  accessEndsAt: true,
});

export const insertCourseOrderSchema = createInsertSchema(courseOrders).pick({
  customerEmail: true,
  customerName: true,
  courseId: true,
  offerId: true,
  stripePaymentIntentId: true,
  stripeSessionId: true,
  amount: true,
  status: true,
});

// Types
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Section = typeof sections.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = z.infer<typeof insertMembershipSchema>;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type CourseOrder = typeof courseOrders.$inferSelect;
export type InsertCourseOrder = z.infer<typeof insertCourseOrderSchema>;
