# Fifth Element Somatics - Complete Website Ecosystem

## Overview
This project delivers a comprehensive full-stack web application for Fifth Element Somatics, expanding from a single masterclass page to a complete website ecosystem. It features multiple pages including home, about, work with me, and a dedicated masterclass landing page, showcasing Saint's somatic sexology practice and "The Good Girl Paradox" masterclass with full e-commerce functionality. The application aims to provide an authentic brand experience, facilitate 1:1 mentorship applications, capture leads via free meditation downloads, and offer an interactive quiz system, all managed through a robust admin dashboard. The core vision is to create a complete digital presence for Fifth Element Somatics, enhancing user engagement and streamlining business operations.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes
- **August 6, 2025**: Completed underwater mystical transformation of Holy Mess workshop page
- **Client Approval**: Var-B selected as final version with 100+ animated underwater effects
- **Page Variants**: Original, Var-B (FINAL), and Var-C (professional) saved as backups
- **Visual Design**: Implemented comprehensive underwater theme with floating bubbles, light rays, particle systems, and enhanced interactivity

## System Architecture

The application adopts a monorepo structure, clearly separating client, server, and shared components.

### UI/UX Design
- **Theme**: Dark mode with custom Fifth Element Somatics branding.
- **Colors**: Purple mystique (#C77DFF), rose deep, gold accent, charcoal backgrounds.
- **Typography**: Mix of serif fonts for headings and sans-serif for body text.
- **Responsiveness**: Mobile-first design principles are applied across the entire site using Tailwind responsive utilities.
- **Branding Consistency**: The authentic Fifth Element Somatics tiger logo is consistently integrated across all navigation headers, footers, social sharing images, and the browser favicon.
- **Interactive Elements**: Features include an expandable/collapsible FAQ section, an interactive quiz system with voice narration, and a synchronized meditation visual system.

### Technical Implementation
- **Frontend**: Developed with React and TypeScript, using Vite for efficient build processes.
  - **Component Library**: Utilizes shadcn/ui built on Radix UI primitives.
  - **Styling**: Leverages Tailwind CSS with a custom design system.
  - **Routing**: Wouter is used for client-side routing.
  - **Forms**: React Hook Form with Zod validation ensures robust form handling.
  - **State Management**: TanStack Query manages server state, complemented by React hooks for local state.
- **Backend**: Built with Express.js and TypeScript.
  - **API Framework**: Express.js handles API endpoints.
  - **Payment Integration**: Stripe SDK manages payment intent creation and webhook processing.
  - **Session Management**: `connect-pg-simple` stores sessions in PostgreSQL.
- **Database**: PostgreSQL is used for data persistence, managed with Drizzle ORM.
  - **Schema**: Key tables include `users`, `purchases`, `applications`, and `leads`.

### Feature Specifications
- **Multi-Page Architecture**: Includes home, about, work-with-me, and masterclass pages with consistent navigation.
- **E-commerce**: Full functionality for masterclass purchases, integrated with Stripe.
- **Application System**: A 1:1 mentorship application form with database persistence and an admin review system.
- **Lead Capture**: Free meditation download with email capture and automated email delivery.
- **Admin Dashboard**: A comprehensive interface for managing applications, leads, email marketing, analytics, and content.
- **Interactive Quiz**: "Good Girl Archetype" quiz with social sharing, personalized results, email capture, and admin analytics.
- **Email System**: Automated email marketing with branded templates, specific styling, and dynamic content.
- **SEO & Social Sharing**: Comprehensive Open Graph meta tags, Twitter Cards, and custom social share images for viral marketing.

### System Design Choices
- **Monorepo Structure**: Facilitates clear separation and management of client, server, and shared components.
- **Scalability**: Designed for potential growth with robust database and API structures.
- **User Experience (UX)**: Prioritizes intuitive navigation, responsive design, and seamless user flows, including integrated contact forms across the site.
- **Security**: Incorporates webhook signature verification and robust session management.

## External Dependencies

### Payment Processing
- **Stripe**: Provides comprehensive payment infrastructure, including Payment Elements for secure card collection, webhooks for payment confirmations, and the Payment Intent API.

### Database
- **Neon Database**: Serverless PostgreSQL hosting solution.
- **Drizzle Kit**: Utilized for database migrations and schema management.

### UI Components
- **Radix UI**: Offers headless component primitives, enhancing accessibility.
- **shadcn/ui**: A library of pre-built UI components.
- **Lucide React**: An icon library used throughout the application.

### Development Tools
- **Vite**: Frontend build tool, supporting Hot Module Replacement (HMR).
- **ESBuild**: Used for bundling the backend for production environments.
- **TypeScript**: Ensures type safety across both frontend and backend development.