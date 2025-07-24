# Fifth Element Somatics - Complete Website Ecosystem

## Overview

This is a comprehensive full-stack web application for Fifth Element Somatics, featuring a complete website ecosystem with multiple pages including home, about, work with me, and the masterclass landing page. The application showcases Saint's somatic sexology practice and "The Good Girl Paradox" masterclass with full e-commerce functionality. Built with React on the frontend, Express.js on the backend, and integrates with Stripe for payment processing. Uses PostgreSQL database with Drizzle ORM for data persistence.

## Recent Changes (January 2025)

- **Complete Website Expansion**: Transformed from single masterclass page to full Fifth Element Somatics ecosystem
- **Multi-Page Architecture**: Added home, about, work-with-me, and dedicated masterclass pages with proper navigation
- **Authentic Branding Integration**: Incorporated content and design from original Fifth Element Somatics website
- **Mobile-First Design**: Maintained responsive design across all new pages with compressed spacing for mobile optimization
- **Navigation System**: Implemented consistent navigation across all pages with proper routing via Wouter
- **Database Integration**: Added PostgreSQL database with Drizzle ORM, replaced memory storage with persistent database storage
- **Application System**: Built complete 1:1 mentorship application form with database persistence and admin review system
- **Lead Capture**: Implemented free meditation download with email capture for marketing funnel
- **Admin Dashboard**: Created comprehensive admin interface with tabs for managing applications and leads
- **Error Resolution**: Fixed all Stripe Elements context errors and non-functional buttons across the website
- **QA & Polish**: Completed comprehensive quality assurance testing, fixed placeholder links, updated Instagram links to authentic URLs, verified all API endpoints, forms, and payment processing functionality
- **Interactive Quiz System**: Built viral "Good Girl Archetype" quiz with social sharing features, personalized results (People-Pleaser, Perfectionist, Awakened Rebel), email capture integration, and quiz data analytics in admin dashboard
- **Voice Narration Integration**: Added Eleven Labs AI voice narration to quiz with auto-play questions AND answer options, dual audio controls (Play All / Replay Options), sound toggle, and visual audio indicators for enhanced accessibility and engagement
- **Interactive Masterclass Demo**: Created auto-advancing slideshow walkthrough that activates when clicking video play button, showing 6 educational steps plus final CTA for masterclass preview
- **Email System Update**: Replaced all contact email addresses from raj@raj.net to hello@fifthelementsomatics.com across all pages (home, about, work-with-me, masterclass, watch), forms, and footer sections
- **Complete Meditation Download System**: Created free 10-minute grounding meditation download feature with audio player, device download functionality, email capture integration, automatic email delivery with branded templates, and admin dashboard tracking for meditation leads
- **Comprehensive SEO & Social Sharing Optimization**: Implemented complete Open Graph meta tags, Twitter Cards, and custom social share images across all pages for viral marketing optimization. Added SEOHead component with dynamic meta tag management, page-specific social images (masterclass-share.svg, quiz-share.svg, meditation-share.svg), and optimized sharing for iMessage, WhatsApp, and social platforms
- **Phase 1 Navigation Updates (January 23, 2025)**: Successfully integrated tiger logo (tiger_1753292965014.png) as homepage link across all navigation sections. Updated all page navigation text to ALL CAPS for consistency. Implemented consistent mobile hamburger menu with proper tiger logo integration. Completed updates across: home.tsx, about.tsx, masterclass.tsx, work-with-me.tsx, quiz.tsx, and free-meditation.tsx pages
- **FAQ Enhancement & Logo Consistency**: Added expandable/collapsible FAQ section with smooth animations, chevron icons, and individual expand/collapse functionality. Updated footer logo on masterclass page to use proper tiger logo for complete brand consistency across entire site
- **Advanced Admin Dashboard System (January 24, 2025)**: Built comprehensive admin center with CMS, email marketing, affiliate management, analytics, and advanced lead management. Created robust database schema with 15+ new tables including content pages, email sequences, analytics tracking, affiliate management, customer tagging, and lead notes. Implemented advanced admin interface with 6 major sections: Analytics (revenue tracking, conversion funnels, traffic sources), Email Marketing (automated sequences, delivery tracking), Affiliates (commission management, click tracking), CMS (content management, media library), Lead Management (status tracking, notes, tagging), and Settings (system configuration). All admin functions include proper authentication via magic links and session management with cookie-parser middleware integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, using Vite for build tooling
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Payment Processing**: Stripe integration
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Component Library**: Built on shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation (via @hookform/resolvers)
- **State Management**: TanStack Query for API state, React hooks for local state

### Backend Architecture
- **API Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Payment Integration**: Stripe SDK for payment intent creation and webhook handling
- **Session Management**: Uses connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reloading with Vite integration

### Database Schema
The application uses four main tables:
- **users**: Basic user authentication (id, username, password)
- **purchases**: Purchase records with Stripe integration (id, email, stripe_payment_intent_id, amount, has_return_to_body_addon, created_at)
- **applications**: 1:1 mentorship applications (id, name, email, phone, experience, intentions, challenges, support, created_at)
- **leads**: Email capture for free meditation downloads (id, email, name, source, created_at)

### UI/UX Design
- **Theme**: Dark mode with custom Fifth Element Somatics branding
- **Colors**: Purple mystique (#C77DFF), rose deep, gold accent, charcoal backgrounds
- **Typography**: Mix of serif fonts for headings and sans-serif for body text
- **Responsive**: Mobile-first design with Tailwind responsive utilities

## Data Flow

1. **Purchase Flow**:
   - User visits home page and selects masterclass options
   - Redirected to checkout page with Stripe Elements integration
   - Payment intent created via `/api/create-payment-intent` endpoint
   - Stripe handles payment processing
   - Webhook confirms payment and stores purchase record
   - User redirected to watch page with email verification

2. **Access Verification**:
   - Watch page queries `/api/verify-purchase/{email}` endpoint
   - Backend validates purchase exists and returns access status
   - Video content displayed if purchase verified

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment infrastructure including:
  - Payment Elements for secure card collection
  - Webhooks for payment confirmation
  - Payment Intent API for one-time payments

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migrations and schema management

### UI Components
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend build tool with HMR
- **ESBuild**: Backend bundling for production
- **TypeScript**: Type safety across the stack

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint secret
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key (frontend)

### Production Considerations
- Session storage configured for PostgreSQL
- Static file serving for built React app
- Error handling middleware for API routes
- Webhook signature verification for security

The application is designed for deployment on platforms like Replit, with development-specific features like the Replit dev banner and cartographer plugin for enhanced development experience.