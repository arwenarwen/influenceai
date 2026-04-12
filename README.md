# InfluenceHub — AI-Powered Influencer Collaboration Platform

A full-stack web platform where companies can request influencer collaborations, powered by an AI matching and discovery engine.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 18, Tailwind CSS |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (JWT + Google OAuth) |
| AI Engine | OpenAI GPT-4o-mini + Rule-based scoring |
| UI Components | Radix UI primitives + custom components |
| Deployment | Vercel (frontend + API) + Neon/Supabase (database) |

---

## Features

### Content Creators
- Sign up with email, Google, or social logins
- Add social media handles (TikTok, YouTube, Instagram, etc.)
- Profile with niche, audience demographics, engagement metrics
- Dashboard: view pending requests, accept/decline/negotiate campaigns
- Track past collaborations and earnings
- Upload portfolio content

### Brands / Companies
- Company profile with industry, description, contact info
- Search and filter creators by: gender, niche, audience size, platform, engagement
- Multi-step campaign creation wizard with full brief
- Campaign analytics: ROI, reach, engagement tracking

### AI Broker / Admin
- Receives all company requests
- **AI Matchmaking**: Scores creators using 7-dimensional scoring model
  - Niche relevance (25%)
  - Audience fit (20%)
  - Engagement quality (20%)
  - Platform compatibility (15%)
  - Influencer tier (10%)
  - Budget alignment (5%)
  - Brand safety (5%)
- **AI Discovery**: Scans TikTok, Instagram, YouTube to discover & categorize unregistered creators
- GPT-powered bio/content NLP analysis
- Admin dashboard: manage campaigns, matches, disputes

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (local, Supabase, or Neon)
- OpenAI API key (optional — platform works without it using rule-based matching)

### 1. Clone and install

```bash
git clone <your-repo>
cd influencer-platform
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/influencehub"
AUTH_SECRET="your-secret-32-chars"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
OPENAI_API_KEY="sk-..."   # optional
```

### 3. Setup database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed demo data
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@influencehub.io | admin123456 |
| Creator | sarah@creator.io | creator123456 |
| Creator | marcus@creator.io | creator123456 |
| Brand | hello@techvibe.com | brand123456 |

---

## Project Structure

```
influencer-platform/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx          # Sign-in page
│   │   └── sign-up/page.tsx          # Role-selection + sign-up
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   ├── creator/                  # Creator dashboard
│   │   │   ├── page.tsx              # Creator home
│   │   │   ├── profile/page.tsx      # Profile editor
│   │   │   └── collaborations/page.tsx
│   │   ├── brand/                    # Brand dashboard
│   │   │   ├── page.tsx              # Brand home
│   │   │   ├── search/page.tsx       # Creator search
│   │   │   └── campaigns/
│   │   │       └── new/page.tsx      # Campaign wizard
│   │   └── admin/                    # Admin dashboard
│   │       ├── page.tsx              # Admin overview
│   │       └── discovery/page.tsx    # AI discovery panel
│   ├── api/
│   │   ├── auth/[...nextauth]/       # NextAuth handler
│   │   ├── register/                 # User registration
│   │   ├── creators/                 # Creator CRUD
│   │   ├── campaigns/                # Campaign CRUD
│   │   ├── matches/                  # AI match management
│   │   ├── discovery/                # Platform discovery
│   │   ├── notifications/            # Notification system
│   │   └── analytics/                # Analytics data
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout
│   └── globals.css
├── components/
│   ├── ui/                           # Base UI components
│   ├── layout/sidebar.tsx            # Role-aware sidebar
│   └── providers/session-provider.tsx
├── lib/
│   ├── auth.ts                       # NextAuth configuration
│   ├── prisma.ts                     # Prisma client
│   ├── utils.ts                      # Utility functions
│   └── ai/
│       ├── matching-engine.ts        # AI scoring algorithm
│       └── discovery.ts              # Platform discovery
├── prisma/
│   ├── schema.prisma                 # Full database schema
│   └── seed.ts                       # Demo data seeder
├── middleware.ts                     # Auth + role routing
├── .env.example                      # Environment template
└── package.json
```

---

## AI Architecture

### Matching Engine (`lib/ai/matching-engine.ts`)

The scoring system evaluates each creator against campaign requirements:

```
MatchScore = Σ(
  nicheRelevance   × 0.25  +  # Keyword + semantic niche overlap
  audienceFit      × 0.20  +  # Gender, age, location demographics
  engagementQuality × 0.20 +  # vs. tier-adjusted benchmarks
  platformFit      × 0.15  +  # Required platform overlap
  tierFit          × 0.10  +  # Influencer size preference
  budgetFit        × 0.05  +  # Rate vs. campaign budget
  brandSafety      × 0.05     # Content moderation score
)
```

When OpenAI is configured, GPT-4o-mini generates a natural language explanation of each match.

### Creator Discovery (`lib/ai/discovery.ts`)

1. Scans social platforms using public APIs (mock in dev, real APIs in production)
2. Analyzes each profile with GPT-4o-mini NLP:
   - Detects niches from bio + recent content
   - Classifies content type
   - Generates brand safety score (0–100)
   - Creates a one-sentence summary for brands
3. Stores discovered creators in the `DiscoveredCreator` table
4. Scores them against active campaigns automatically

**Real API integrations:**
- TikTok Research API → `GET /v2/research/user/info/`
- Instagram Graph API → `GET /{user-id}/media`
- YouTube Data API v3 → `GET /channels`
- Twitter API v2 → `GET /2/users/by/username/{username}`

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

Set environment variables in Vercel dashboard or via:
```bash
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
# ... etc
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Database Options

| Provider | Free Tier | Notes |
|----------|-----------|-------|
| **Neon** | 0.5 GB | Best for Vercel, serverless-ready |
| **Supabase** | 500 MB | Comes with Auth, Storage |
| **Railway** | $5/mo | Simple deployment |
| **Local PostgreSQL** | Unlimited | Dev only |

After deploying, run:
```bash
npx prisma migrate deploy
npm run db:seed
```

---

## API Reference

### Authentication
All endpoints require a valid session cookie (NextAuth) except `/api/register`.

### Endpoints

| Method | Path | Role | Description |
|--------|------|------|-------------|
| POST | `/api/register` | Public | Create account |
| GET | `/api/creators` | Brand/Admin | Search creators |
| GET | `/api/creators/me` | Creator | Get own profile |
| PUT | `/api/creators/me` | Creator | Update profile |
| GET | `/api/campaigns` | Brand/Admin | List campaigns |
| POST | `/api/campaigns` | Brand | Create campaign |
| GET | `/api/matches?campaignId=` | All | Get AI matches |
| POST | `/api/matches` | Brand/Admin | Trigger re-matching |
| PATCH | `/api/matches` | Admin | Update match status |
| GET | `/api/discovery` | Admin | List discovered creators |
| POST | `/api/discovery` | Admin | Trigger scan |
| GET | `/api/notifications` | All | Get notifications |
| PATCH | `/api/notifications` | All | Mark as read |
| GET | `/api/analytics` | Brand/Admin | Dashboard analytics |

---

## Roadmap

- [ ] Stripe payment integration for campaigns and broker commissions
- [ ] Real-time push notifications (WebSockets/Pusher)
- [ ] Mobile app (React Native)
- [ ] TikTok Research API real integration
- [ ] Portfolio media upload (AWS S3)
- [ ] Automated campaign performance tracking
- [ ] A/B testing for AI scoring weights
- [ ] Creator verification system
- [ ] Multi-language support

---

## License

MIT © 2026 InfluenceHub
