# Sistema de Gestão Musical para Igreja

## Overview

This is a comprehensive church music management system built with React and TypeScript on the frontend, Express.js on the backend, with PostgreSQL as the database using Drizzle ORM. The system is designed to help coordinate musicians, schedule masses, manage music libraries, and track performance history for church musical activities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router for client-side navigation
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling
- **Database ORM**: Drizzle ORM with type-safe queries
- **Session Storage**: PostgreSQL-based sessions with connect-pg-simple

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Backup Database**: Supabase (dual database support)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for schema management

## Key Components

### 1. Musician Management (`musicos`)
- Musician profiles with contact information
- Availability tracking
- Role/instrument assignments
- Personal notes and suggestions system
- Profile photos and permanent observations

### 2. Mass Scheduling (`missas`)
- Date and time scheduling
- Mass type categorization
- Musician assignments per mass
- Observational notes for each service

### 3. Music Library (`biblioteca_musicas`)
- Song catalog with metadata
- YouTube integration for music discovery
- Liturgical section categorization
- Sheet music and download links
- Thumbnail and duration tracking

### 4. Mass-Music Relationships (`missa_musicas`)
- Songs assigned to specific masses
- Liturgical order management
- Performance tracking

### 5. Annotation System
- Musician-specific notes (`musico_anotacoes`)
- Suggestion tracking with status management (`musico_sugestoes`)

## Data Flow

### Client-Side Data Management
1. **Local Storage Hooks**: Custom hooks for offline-first data persistence
2. **Supabase Integration**: Real-time database synchronization
3. **YouTube API**: Music search and metadata retrieval
4. **Form Validation**: Zod schemas for type-safe form handling

### Server-Side Data Flow
1. **API Routes**: RESTful endpoints with Express.js
2. **Database Queries**: Type-safe Drizzle ORM operations
3. **Session Management**: PostgreSQL-based user sessions
4. **Error Handling**: Centralized error middleware

### Database Schema Design
- **Musicians Table**: Core musician information
- **Masses Table**: Service scheduling data
- **Music Library**: Centralized song database
- **Relationship Tables**: Many-to-many relationships between entities
- **Annotation Tables**: Flexible note and suggestion system

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router)
- Vite build tooling with TypeScript support
- Express.js with TypeScript configuration

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- shadcn/ui component library

### Database and Backend
- Drizzle ORM with PostgreSQL driver
- Neon serverless PostgreSQL client
- Supabase client for backup database
- connect-pg-simple for session storage

### External APIs
- YouTube Data API v3 for music search
- Supabase for real-time database features

### Development Tools
- TypeScript for type safety
- ESLint and Prettier for code quality
- PostCSS for CSS processing
- Various Radix UI component packages

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit environment
- **Port Configuration**: Local port 5000, external port 80
- **Hot Reload**: Vite HMR with Express middleware
- **Database**: PostgreSQL 16 module in Replit

### Production Build
- **Build Command**: `npm run build` (Vite + esbuild)
- **Start Command**: `npm run start` (production Node.js)
- **Deployment Target**: Autoscale deployment on Replit
- **Static Assets**: Served from `dist/public` directory

### Database Configuration
- **Primary**: Neon serverless PostgreSQL
- **Backup**: Supabase PostgreSQL
- **Migrations**: Drizzle migrations in `migrations/` directory
- **Schema**: Centralized schema in `shared/schema.ts`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment detection
- YouTube API key for music search functionality

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```