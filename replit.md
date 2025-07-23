# Fifth Element Somatics - Complete Website Ecosystem

## Overview

This is a comprehensive full-stack web application for Fifth Element Somatics, featuring a complete website ecosystem with multiple pages including home, about, work with me, and the masterclass landing page. The application showcases Saint's somatic sexology practice and "The Good Girl Paradox" masterclass with full e-commerce functionality. Built with React on the frontend, Express.js on the backend, and integrates with Stripe for payment processing. Uses PostgreSQL database with Drizzle ORM for data persistence.

## Recent Changes (January 2025)

- **Complete Website Expansion**: Transformed from single masterclass page to full Fifth Element Somatics ecosystem
- **Multi-Page Architecture**: Added home, about, work-with-me, and dedicated masterclass pages with proper navigation
- **Authentic Branding Integration**: Incorporated content and design from original Fifth Element Somatics website
- **Mobile-First Design**: Maintained responsive design across all new pages with compressed spacing for mobile optimization
- **Navigation System**: Implemented consistent navigation across all pages with proper routing via Wouter

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
The application uses two main tables:
- **users**: Basic user authentication (id, username, password)
- **purchases**: Purchase records with Stripe integration (id, email, stripe_payment_intent_id, amount, has_return_to_body_addon, created_at)

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