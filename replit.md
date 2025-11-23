# LinguaLife - K-12 Language Learning Platform

## Overview

LinguaLife is an interactive K-12 language learning application that teaches Spanish, French, and Mandarin through real-life scenario-based learning. The platform uses gamified flashcards, quizzes, and progress tracking to help students master practical vocabulary in contexts like shopping, dining, traveling, school, and home environments. Drawing inspiration from Duolingo's gamification and Khan Academy's educational clarity, the app emphasizes visual learning with imagery paired to every concept and progressive difficulty levels from beginner to advanced.

## Recent Changes (November 17, 2025)

**Multi-Language Architecture Complete:**
- Fixed language parameter propagation through all API calls (scenario queries, flashcard mutations, quiz submissions)
- Added language selector UI to scenario page with Globe icon and dropdown
- Implemented language-specific progress cache invalidation
- Query keys now include language parameters for proper data isolation
- All API endpoints accept and respect language query parameters

**Current Status:**
- MVP is fully functional with complete Spanish vocabulary across all scenarios
- French and Mandarin have the infrastructure in place but need vocabulary content to be added
- Architecture supports full multi-language isolation when content is populated
- Progress tracking works correctly per language selection

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching
- Tailwind CSS for utility-first styling with custom theme extensions

**UI Component System:**
- Radix UI primitives for accessible, unstyled component foundations
- shadcn/ui component library with "new-york" style preset
- Custom design system with Nunito (primary) and Quicksand (accent) Google Fonts
- Comprehensive component palette including cards, dialogs, forms, navigation, and data display elements

**State Management:**
- React Query for asynchronous server state with disabled refetching (staleTime: Infinity)
- Local component state with React hooks
- Toast notifications for user feedback
- Theme toggle supporting light/dark modes with localStorage persistence

**Key Pages:**
- Home: Landing page with scenario cards showcasing available learning paths
- Dashboard: Progress tracking, language selection, and scenario overview
- Scenario: Detailed learning interface with flashcard and quiz tabs

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for API server
- Custom middleware for request logging and JSON parsing
- Vite middleware integration for development with HMR support

**API Design:**
- RESTful endpoints for scenarios, progress tracking, and quiz submission
- Default demo user system (no authentication required)
- Language-specific content delivery via query parameters

**Core API Endpoints:**
- `GET /api/scenarios` - Retrieve all scenarios for a language
- `GET /api/scenarios/:id` - Get detailed scenario with vocabulary
- `GET /api/progress/:language` - Fetch user progress for specific language
- `POST /api/progress` - Update user learning progress
- `POST /api/quiz/submit` - Submit quiz results

**Data Layer:**
- In-memory storage implementation (MemStorage class) for development
- Progress tracking includes completed scenarios, mastered words, streaks, and study dates
- Vocabulary items contain translations, pronunciations, example sentences, images, and difficulty levels

### Data Storage Solutions

**Current Implementation:**
- In-memory Map-based storage for user progress and scenario data
- Hardcoded vocabulary data in TypeScript files with imported image assets

**Database Configuration:**
- Drizzle ORM configured with PostgreSQL dialect
- Connection via Neon Database serverless driver (@neondatabase/serverless)
- Schema definition in shared/schema.ts with Zod validation
- Migration output configured to ./migrations directory
- Session management prepared with connect-pg-simple for PostgreSQL sessions

**Data Models:**
- VocabularyItem: Word/phrase with translation, pronunciation, examples, images, and difficulty
- Scenario: Collection of vocabulary items with title, description, and icon
- UserProgress: Tracking of completed scenarios, mastered words, streaks, and study metrics
- QuizQuestion: Multiple-choice, fill-in-blank, or matching question types
- QuizResult: Score and performance data for completed quizzes

### External Dependencies

**UI Component Libraries:**
- @radix-ui/* (18 packages) - Accessible component primitives for dialogs, dropdowns, navigation, etc.
- class-variance-authority - Type-safe component variants
- cmdk - Command menu interface
- embla-carousel-react - Touch-friendly carousel component
- lucide-react - Icon library

**Form Management:**
- react-hook-form - Form state and validation
- @hookform/resolvers - Form validation resolver utilities
- zod - Schema validation paired with Drizzle

**Data Fetching:**
- @tanstack/react-query - Async state management with caching

**Styling:**
- tailwindcss with custom configuration
- clsx and tailwind-merge for conditional class composition
- date-fns for date formatting and manipulation

**Database & ORM:**
- drizzle-orm - Type-safe SQL query builder
- drizzle-kit - Schema migration tool
- @neondatabase/serverless - PostgreSQL database driver
- drizzle-zod - Zod schema generation from Drizzle schemas

**Development Tools:**
- Replit-specific plugins for error overlays, cartographer, and dev banners
- TypeScript with strict mode enabled
- ESBuild for production bundling
- tsx for TypeScript execution in development

**Asset Management:**
- Static image imports from attached_assets/generated_images directory
- Vocabulary flashcards paired with contextual imagery
- Scenario illustrations for visual learning enhancement

## Design System

**Visual Identity:**
- Nintendo-inspired aesthetic with vibrant, playful colors
- Kid-friendly design with large touch targets and clear visual hierarchy
- Smooth animations using Framer Motion for engagement

**Color Palette:**
- Primary: Vibrant purple (#8B5CF6) for key actions and branding
- Secondary: Energetic green (#10B981) for success states
- Accent: Warm yellow (#F59E0B) for highlights
- Alert: Bright orange (#F97316) for attention-grabbing elements

**Typography:**
- Primary font: Nunito (rounded, friendly sans-serif)
- Accent font: Quicksand (soft, approachable)
- Font sizes optimized for readability in K-12 age range

**Component Style:**
- Rounded corners (rounded-md) throughout
- Generous spacing for touch-friendly interactions
- Elevated cards with subtle shadows
- Smooth hover and active state transitions using custom elevation utilities

## Known Limitations & Future Enhancements

**Content:**
- Spanish vocabulary is complete across all scenarios and difficulty levels
- French and Mandarin require vocabulary content population (infrastructure ready)
- Word IDs currently don't encode language prefix (future enhancement for better isolation)

**Features Ready for Extension:**
- Additional scenarios beyond the current 5 (shopping, dining, traveling, school, home)
- Audio pronunciation support (UI ready, needs audio asset integration)
- Achievement badges and rewards system (progress tracking foundation in place)
- Social features and leaderboards (user system extensible)