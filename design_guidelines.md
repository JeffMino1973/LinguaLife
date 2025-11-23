# LinguaLife - K-12 Language Learning Platform Design Guidelines

## Design Approach
**Nintendo-Inspired Playful Learning:** Drawing inspiration from Duolingo's gamification and Khan Academy's educational clarity, LinguaLife creates a vibrant, kid-friendly environment that makes language learning feel like an adventure.

## Core Design Principles
1. **Playful Engagement:** Bright colors, smooth animations, and rewarding interactions
2. **Visual Learning:** Every vocabulary word paired with contextual imagery
3. **Progressive Mastery:** Clear difficulty levels from beginner to advanced
4. **Gamified Progress:** Streaks, badges, and achievements to motivate K-12 learners
5. **Multi-Language Support:** Seamless switching between Spanish, French, and Mandarin

## Typography
- **Primary Font:** Nunito (Google Fonts) - rounded, friendly, approachable
- **Accent Font:** Quicksand (Google Fonts) - soft, playful for headings
- **Hierarchy:**
  - Page Titles: text-4xl to text-5xl, font-bold
  - Scenario Cards: text-2xl, font-semibold
  - Vocabulary Words: text-3xl, font-bold
  - Translations: text-xl, font-medium
  - Body Text: text-base to text-lg
  - Metadata: text-sm

## Color Palette
**Primary:** Vibrant Purple (#8B5CF6) - Brand color, main CTAs, active states
**Secondary:** Energetic Green (#10B981) - Success, completed items, progress indicators
**Accent:** Warm Yellow (#F59E0B) - Highlights, attention, rewards
**Alert:** Bright Orange (#F97316) - Reminders, streaks, important actions

## Layout System
**Spacing:** Generous, kid-friendly spacing using Tailwind's 4, 6, 8, 12, 16 units
- Card padding: p-6, p-8
- Section gaps: gap-6, gap-8
- Page margins: max-w-7xl mx-auto px-4

## Component Patterns

### Scenario Cards (Dashboard)
- **Grid Layout:** 2-3 columns responsive
- **Card Structure:**
  - Large icon header (emoji or lucide icon)
  - Scenario title (text-2xl, font-bold)
  - Description (text-muted-foreground)
  - Progress bar with percentage
  - Vocabulary count badge
  - Hover: Slight elevation and scale

### Flashcard Interface
- **Flip Animation:** Smooth 3D card flip using transform
- **Front:** Word, pronunciation, audio button, image
- **Back:** Translation, example sentence, usage context
- **Controls:** Previous/Next arrows, progress indicator (e.g., "3/20")
- **Actions:** "Mark as Mastered" button, audio pronunciation

### Progress Dashboard
- **4-Stat Cards:** Total words, scenarios completed, current streak, accuracy
- **Language Selector:** Tab-based or dropdown with flag icons
- **Scenario Grid:** Visual cards showing completion status
- **Achievement Wall:** Badge showcase with unlock animations

### Navigation
- **Top Nav:** Logo, language selector, user profile, theme toggle
- **Mobile:** Hamburger menu with drawer
- **Active States:** Bold text, primary color accent, subtle underline

## Icons
**Lucide React Icons:**
- Scenarios: ShoppingBag, UtensilsCrossed, Plane, GraduationCap, Home
- Actions: Volume2, Check, X, ChevronLeft, ChevronRight, Play
- Progress: TrendingUp, Award, Flame, Calendar
- Settings: Globe, Moon, Sun, User

## Images
**Vocabulary Visuals:**
- Contextual images for every flashcard
- Size: 400x300px minimum, high quality
- Style: Bright, clear, culturally appropriate
- Generated images stored in attached_assets/generated_images

**Scenario Headers:**
- Large banner images (1200x400px)
- Represent real-life contexts (shopping mall, restaurant, airport, classroom, home)
- Vibrant, inviting, diverse representation

## Animations
**Smooth Transitions:**
- Card flips: 0.6s ease-in-out
- Button hover: subtle scale (1.02-1.05)
- Progress bars: smooth width transitions
- Success celebrations: Confetti or sparkle effects
- Page transitions: Fade in/out (0.3s)

## Layout Templates

### Landing Page
1. **Hero:** Large image, catchy headline, "Start Learning" CTA
2. **Language Showcase:** 3-column grid of Spanish/French/Mandarin cards
3. **Features:** Icon + text grid explaining flashcards, audio, progress tracking
4. **Social Proof:** Sample achievement badges, testimonials
5. **Final CTA:** Join now, start first scenario

### Dashboard
1. **Welcome Header:** Greeting, current streak flame indicator
2. **Stats Row:** 4 metric cards
3. **Language Toggle:** Pills or tabs for Spanish/French/Mandarin
4. **Scenario Grid:** 2-3 column cards with progress
5. **Recent Activity:** List of recently studied words

### Scenario Learning Page
1. **Header:** Scenario title, language, progress (e.g., "Shopping - Spanish - 5/20")
2. **Tabs:** "Flashcards" and "Quiz"
3. **Flashcard View:** Centered large card, navigation controls, mastery button
4. **Quiz View:** Question card, multiple choice options, score display

## Interaction Patterns
- **Audio Buttons:** Prominent, one-click pronunciation playback
- **Gamified Feedback:** Checkmarks, stars, and points for correct answers
- **Undo-Friendly:** Easy to go back, review, or restart
- **Accessible:** Large touch targets (min 44x44px), high contrast, screen reader support
- **Responsive:** Mobile-first, adapts gracefully to tablets and desktops

## Dark Mode
- Toggle in nav bar (Sun/Moon icon)
- Maintains vibrant colors with adjusted saturation
- Card backgrounds slightly elevated from page background
- Text contrast meets WCAG AA standards

This design system creates an engaging, educational environment that makes language learning feel like a fun adventure for K-12 students.
