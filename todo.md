# Anom Artsy Social Platform — Development Roadmap

## Phase 1: Foundation & Database Schema
- [x] Design and implement database schema (users, profiles, coins, achievements, lounges, merch orders)
- [x] Set up Tailwind CSS with neon dark theme (magenta #ff00cc, cyan #00eaff, deep purple, dark #0b0e14)
- [x] Create global styling and component library for neon aesthetic
- [x] Set up authentication and user session management

## Phase 2: Neon Dark UI Foundation
- [x] Build responsive navigation and layout shell
- [x] Create reusable neon button, card, and input components
- [x] Implement dark theme provider and color system
- [x] Build landing/home page with brand messaging

## Phase 3: User Profiles & Neon Identity Customization
- [x] Create user profile page with avatar and bio
- [x] Design and implement decoration package system (character badges, mood glows, neon themes)
- [x] Build package marketplace (purchasable with Anom Coin or real money)
- [x] Implement profile customization UI (apply packages without coding)
- [x] Add profile preview and sharing functionality

## Phase 4: Anom Coin Economy & Level/Achievement System
- [x] Design coin earning mechanics (Social Good actions, game completions, milestones)
- [x] Implement coin balance tracking and transactions
- [x] Create XP-based level progression system
- [x] Design and implement achievement badges (visual, unlockable)
- [x] Build user dashboard showing coins, level, and achievements
- [ ] Create leaderboard (optional but recommended)

## Phase 5: Private Lounges (Family, Friends, Coworkers)
- [x] Design lounge data model and access control
- [x] Create lounge creation and purchase flow (Anom Coin or real money)
- [x] Build lounge chat interface with real-time messaging
- [ ] Implement shared goals and milestone tracking within lounges
- [x] Add customizable neon themes for each lounge type
- [x] Build lounge member management and invitations

## Phase 6: Kids Corner with Pixel & Dot & Off-Grid Adventure
- [x] Integrate Pixel & Dot episode videos (Episodes 1-6)
- [x] Build interactive coloring page for kids
- [x] Embed Off-Grid Adventure educational game (kids edition)
- [ ] Implement kid-safe content filtering and parental controls
- [x] Create Kids Corner dashboard with progress tracking
- [ ] Add lesson completion tracking and Anom Coin rewards for kids

## Phase 7: Social Feed (Live from the Universe)
- [x] Design social feed layout and card components
- [x] Integrate AO Meme Library content into feed
- [ ] Build member highlight system (user spotlights)
- [ ] Create universe update announcements section
- [ ] Implement feed filtering and sorting (recent, trending, by category)
- [x] Add like/comment/share functionality for feed posts

## Phase 8: Mini-Games Integration (Trivia, Memory, Mood Matcher, Snack Vault Rush)
- [x] Embed AO Trivia game with score tracking
- [x] Embed Neon Memory game with score tracking
- [x] Embed Mood Matcher game with score tracking
- [x] Embed Snack Vault Rush game with score tracking
- [ ] Link game scores to Anom Coin reward system
- [x] Build games leaderboard
- [ ] Implement daily/weekly challenges with bonus rewards

## Phase 9: White-Glove Bespoke Merch Workflow
- [x] Create custom merch request form (customer submits idea)
- [x] Build merch request dashboard for owner (review, approve, create)
- [ ] Implement payment processing for merch orders (Stripe/PayPal)
- [ ] Create order fulfillment workflow (owner uploads to Printful/Spreadshop backend)
- [x] Build customer order tracking page
- [ ] Add notification system for order status updates
- [x] Implement merch portfolio/gallery (showcase completed pieces)

## Phase 10: Admin Dashboard
- [x] Build admin-only access control and role management
- [x] Create merch order management interface
- [ ] Build lounge purchase approval system
- [ ] Implement user management (view levels, achievements, coins)
- [ ] Create notification inbox for owner (custom requests, new orders, system alerts)
- [x] Build analytics dashboard (user growth, coin circulation, engagement metrics)
- [ ] Add moderation tools for community content

## Phase 12: Backend Integration & Testing
- [x] Implement tRPC procedures for merch requests
- [x] Implement tRPC procedures for admin operations
- [x] Add database helpers for merch and admin queries
- [x] Wire frontend to use real backend procedures
- [x] Enforce role-based access control on backend
- [x] Write vitest tests for merch procedures
- [x] Write vitest tests for admin procedures
- [x] Write integration tests for full workflows

## Phase 11: Final Testing, Polish & Deployment
- [x] Responsive design testing across devices
- [x] Cross-browser compatibility testing
- [ ] Performance optimization and load testing
- [ ] Security audit (payment, user data, authentication)
- [ ] User acceptance testing (UAT) with sample users
- [ ] Final polish on neon aesthetic and animations
- [ ] Deploy to Anoms-Hub organization
- [ ] Set up live domain (anomartsy.xyz)
- [ ] Monitor and iterate based on user feedback

## Styling & Brand Consistency
- [ ] Apply neon dark theme consistently across all pages
- [ ] Use exact brand colors: magenta (#ff00cc), cyan (#00eaff), deep purple, dark (#0b0e14)
- [ ] Ensure responsive design on mobile, tablet, and desktop
- [ ] Implement smooth neon glow effects and transitions
- [ ] Add micro-interactions and hover states for all interactive elements
- [ ] Test color contrast for accessibility

## Content & Copy
- [ ] Finalize all platform copy and messaging
- [ ] Integrate Pixel & Dot episode content
- [ ] Populate AO Meme Library content
- [ ] Create onboarding tutorial for new users
- [ ] Write help/FAQ documentation

## Post-Launch
- [ ] Monitor user engagement and feedback
- [ ] Iterate on features based on user behavior
- [ ] Plan Phase 2 features (social groups, events, advanced customization)
- [ ] Build community moderation guidelines
- [ ] Plan marketing and user acquisition strategy

## Phase 13: Collaboration Station for Social Good
- [x] Design collaboration project data model (title, description, cause, members, tasks)
- [x] Create collaboration project creation flow with cause categories
- [x] Build project dashboard with member list and contribution tracking
- [x] Implement task creation and assignment within projects
- [x] Add progress tracking and milestone completion
- [x] Build collaboration feed showing project updates
- [ ] Implement Anom Coin rewards for project contributions
- [x] Create project discovery and browsing page
- [ ] Add project sharing and invitation system
- [ ] Build project completion and impact reporting
