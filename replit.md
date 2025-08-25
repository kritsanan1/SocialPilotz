# Overview

SociaLink is a social media management platform built with React and Express.js. The application allows users to compose, schedule, and post content across multiple social media platforms (LinkedIn, Twitter, Instagram, Facebook, etc.) with analytics tracking and content management features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite for development and build tooling
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod for form validation and type safety

## Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Development Setup**: Vite middleware integration for hot reloading in development
- **Storage Interface**: Abstracted storage layer with in-memory implementation (ready for database integration)
- **Database ORM**: Drizzle ORM configured for PostgreSQL with migrations support
- **Session Management**: Express sessions with PostgreSQL session store support

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Type-safe schema definitions with Drizzle and Zod validation
- **Migrations**: Drizzle Kit for database migrations and schema evolution
- **Connection**: Neon Database serverless PostgreSQL connection

## Authentication and Authorization
- **User Management**: Basic user schema with username/password authentication
- **Session Storage**: PostgreSQL-backed session storage using connect-pg-simple
- **Type Safety**: Shared TypeScript types between client and server for user entities

## Project Structure
- **Monorepo Setup**: Client and server code in separate directories with shared schema
- **Client**: React application in `/client` directory with component-based architecture
- **Server**: Express API in `/server` directory with route abstraction
- **Shared**: Common TypeScript types and database schema in `/shared` directory

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM and database toolkit
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router

## UI and Styling
- **@radix-ui/***: Headless UI components for accessibility and functionality
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-***: Replit-specific development plugins

## Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle and Zod

## Session and Data Management
- **express-session**: Session middleware for Express
- **connect-pg-simple**: PostgreSQL session store
- **nanoid**: Unique ID generation

The application is designed to integrate with social media APIs (like Ayrshare) for multi-platform posting capabilities, with a scalable architecture supporting both individual users and business accounts.