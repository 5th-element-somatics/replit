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
- **Enhanced Email Branding & Styling (January 26, 2025)**: Upgraded AI email marketing automation with professional branded email templates featuring Fifth Element Somatics styling, custom color schemes, tiger logo integration, responsive design, archetype-specific visual themes, and enhanced typography using Crimson Text and Inter fonts for cohesive brand consistency across all automated email campaigns
- **Version 4 Email Header Implementation (January 26, 2025)**: Updated all AI email templates to use bold dramatic purple gradient header (Version 4) with white text, proper contrast, tiger emoji logo in white circle, and text shadow for perfect readability as selected by user preference
- **Enhanced Typography & Dark Theme Optimization (January 26, 2025)**: Improved email header readability with larger 28px font size, font-weight 700, triple text shadow effects, anti-aliased rendering, fallback fonts (Georgia, Times New Roman, Arial), and enhanced letter spacing for maximum readability across all email clients and dark themes
- **Authentic Brand Integration (January 26, 2025)**: Updated email headers to use authentic Fifth Element Somatics brand colors including deep charcoal #1a0d1f background, warm cream #f5f1e8 text boxes, signature purple #C77DFF accents, and integrated tiger logo replacing emoji for complete brand consistency across all AI email campaigns
- **Comprehensive SEO & Social Sharing Optimization**: Implemented complete Open Graph meta tags, Twitter Cards, and custom social share images across all pages for viral marketing optimization. Added SEOHead component with dynamic meta tag management, page-specific social images (masterclass-share.svg, quiz-share.svg, meditation-share.svg), and optimized sharing for iMessage, WhatsApp, and social platforms
- **Phase 1 Navigation Updates (January 23, 2025)**: Successfully integrated tiger logo (tiger_1753292965014.png) as homepage link across all navigation sections. Updated all page navigation text to ALL CAPS for consistency. Implemented consistent mobile hamburger menu with proper tiger logo integration. Completed updates across: home.tsx, about.tsx, masterclass.tsx, work-with-me.tsx, quiz.tsx, and free-meditation.tsx pages
- **FAQ Enhancement & Logo Consistency**: Added expandable/collapsible FAQ section with smooth animations, chevron icons, and individual expand/collapse functionality. Updated footer logo on masterclass page to use proper tiger logo for complete brand consistency across entire site
- **Advanced Admin Dashboard System (January 24, 2025)**: Built comprehensive admin center with CMS, email marketing, affiliate management, analytics, and advanced lead management. Created robust database schema with 15+ new tables including content pages, email sequences, analytics tracking, affiliate management, customer tagging, and lead notes. Implemented advanced admin interface with 6 major sections: Analytics (revenue tracking, conversion funnels, traffic sources), Email Marketing (automated sequences, delivery tracking), Affiliates (commission management, click tracking), CMS (content management, media library), Lead Management (status tracking, notes, tagging), and Settings (system configuration). All admin functions include proper authentication via magic links and session management with cookie-parser middleware integration.
- **Mobile Navigation Enhancement & Scroll-to-Top Fixes (January 24, 2025)**: Updated all remaining pages (quiz.tsx, free-meditation.tsx) to display "FIFTH ELEMENT SOMATICS" company name alongside tiger logo in mobile header navigation. Fixed scroll-to-top behavior across all form submissions including meditation download, application submissions, quiz results, and admin magic link requests. All pages now scroll to top smoothly after successful form completions.
- **Synchronized Meditation Visual System (January 24, 2025)**: Created comprehensive MeditationVisuals component with 6 distinct meditation phases (settling, breath awareness, body connection, grounding roots, energy flow, integration) that synchronize with the 10-minute audio meditation. Added visual elements including breathing animations, body scanning lights, root system growth, energy streams, and completion rings. Integrated real-time phase indicators and breathing guides that respond to audio playback state. Enhanced CSS with custom animations for meditation visuals including spin-slow, gradient-shift, breathing cycles, and duration utilities.
- **Complete Social Sharing & SEO Optimization System (January 24, 2025)**: Implemented comprehensive social media sharing functionality for meditation page with Facebook, Twitter/X, LinkedIn, WhatsApp, and copy-link options directing to email capture form. Created custom social share images for all pages (home-share.svg, meditation-share.svg, quiz-share.svg, masterclass-share.svg) optimized for 1200x630 format. Enhanced SEO meta tags across entire site with Open Graph, Twitter Cards, WhatsApp optimization, iMessage/Apple tags, and LinkedIn-specific properties. Added comprehensive meta tag management including image dimensions, alt text, site name, locale, and rich snippet structured data for maximum social platform compatibility and viral sharing potential.
- **Complete Tiger Logo Brand Consistency (January 24, 2025)**: Replaced all remaining "5E" logos with authentic tiger branding across entire website. Updated footer sections on home, about, and work-with-me pages to use tiger image instead of circular "5E" logo. Redesigned social share images (home-share.svg, social-share.svg) and favicon.svg to feature tiger silhouettes instead of "5E" text. Achieved complete brand consistency with tiger logo now appearing in navigation headers, footers, social sharing images, browser favicon, and all visual touchpoints throughout the site.
- **Site-Wide Navigation Header Consistency (January 26, 2025)**: Fixed navigation header inconsistency across all pages where "FIFTH ELEMENT SOMATICS" company name now displays consistently next to tiger logo on both desktop and mobile views. Updated all pages (home, about, masterclass, work-with-me, quiz, free-meditation, apply) to show identical navigation header structure with tiger logo + company name visible at all screen sizes for complete brand consistency.

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