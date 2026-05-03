# VOID Platform

> The internet's home for people who actually build things.

VOID is a combined social network + marketplace + knowledge platform built exclusively for developers and hackers. Think GitHub + Product Hunt + eBay + Stack Overflow — rebuilt from scratch, better.

---

## 🚀 Live Deployment Guide

### Prerequisites
- Node.js 18+
- Git
- Accounts at: Vercel, Supabase, Upstash, Cloudflare, Stripe, Resend, Sentry, GitHub

---

## Step 1: Clone & Install

```bash
git clone https://github.com/your-org/void-platform
cd void-platform
npm install
```

---

## Step 2: Set Up Supabase (PostgreSQL)

1. Go to [https://supabase.com](https://supabase.com) → Create new project
2. Choose a region close to your users
3. Go to **Project Settings → Database → Connection string**
4. Copy the **Connection string (URI)** — this is your `DATABASE_URL`
5. Also copy the **Direct connection** URL — this is your `DIRECT_URL`

---

## Step 3: Set Up Upstash Redis

1. Go to [https://console.upstash.com](https://console.upstash.com) → Create Database
2. Choose **Redis** → Select region
3. Go to **Details → REST API** → Copy `UPSTASH_REDIS_REST_URL`
4. For ioredis, use the **Redis URL** from the **Connect** tab

---

## Step 4: Set Up GitHub OAuth

1. Go to [https://github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: VOID
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
4. Copy **Client ID** and **Client Secret**

---

## Step 5: Set Up Google OAuth

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → **APIs & Services → Credentials**
3. Create **OAuth 2.0 Client ID** (Web application)
4. Add authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`
5. Copy **Client ID** and **Client Secret**

---

## Step 6: Set Up Stripe

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Get your **Secret key** and **Publishable key** from API keys
3. Enable **Stripe Connect** in your dashboard
4. Set up a webhook:
   - Go to **Developers → Webhooks → Add endpoint**
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `transfer.created`
   - Copy the **Signing secret**

---

## Step 7: Set Up Cloudflare R2

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **R2 → Create bucket** → Name it `void-platform`
3. Enable **Public access** on the bucket
4. Go to **R2 → Manage R2 API Tokens → Create API Token**
5. Copy **Access Key ID** and **Secret Access Key**
6. Your **Account ID** is in the right sidebar of the Cloudflare dashboard
7. Your **Public URL** is shown in the bucket settings

---

## Step 8: Set Up Resend (Email)

1. Go to [https://resend.com](https://resend.com) → Sign up
2. Go to **API Keys → Create API Key**
3. Add your domain (or use the sandbox for testing)
4. Copy the API key

---

## Step 9: Set Up Sentry

1. Go to [https://sentry.io](https://sentry.io) → Create account
2. Create a new project → Select **Next.js**
3. Copy the **DSN** from the project settings
4. Get an auth token from **Settings → Auth Tokens**

---

## Step 10: Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all values from the steps above.

---

## Step 11: Run Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase
npm run db:push
```

---

## Step 12: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# https://vercel.com/your-project/settings/environment-variables
# Add all variables from .env.example
```

Or deploy via GitHub:
1. Push to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add all environment variables
5. Deploy

---

## Step 13: Update OAuth Callback URLs

After deployment, update your OAuth apps with the real Vercel URL:
- GitHub: `https://your-app.vercel.app/api/auth/callback/github`
- Google: `https://your-app.vercel.app/api/auth/callback/google`

Also update `NEXTAUTH_URL` in Vercel environment variables.

---

## Step 14: Set Up Stripe Webhook

Update your Stripe webhook endpoint URL to your live Vercel URL.

---

## 📋 Complete Environment Variables Reference

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `DATABASE_URL` | Supabase PostgreSQL URL | Supabase → Project Settings → Database |
| `DIRECT_URL` | Supabase direct connection | Supabase → Project Settings → Database |
| `REDIS_URL` | Upstash Redis URL | Upstash → Database → Connect |
| `NEXTAUTH_SECRET` | Random secret | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL | Your Vercel deployment URL |
| `GITHUB_CLIENT_ID` | GitHub OAuth | github.com/settings/developers |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth | github.com/settings/developers |
| `GOOGLE_CLIENT_ID` | Google OAuth | console.cloud.google.com |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | console.cloud.google.com |
| `STRIPE_SECRET_KEY` | Stripe secret | dashboard.stripe.com/apikeys |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public | dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook | dashboard.stripe.com/webhooks |
| `CLOUDFLARE_ACCOUNT_ID` | CF account | dash.cloudflare.com (right sidebar) |
| `R2_ACCESS_KEY_ID` | R2 API key | dash.cloudflare.com → R2 → API Tokens |
| `R2_SECRET_ACCESS_KEY` | R2 API secret | dash.cloudflare.com → R2 → API Tokens |
| `R2_BUCKET_NAME` | R2 bucket name | `void-platform` |
| `R2_PUBLIC_URL` | R2 public URL | R2 bucket settings |
| `RESEND_API_KEY` | Resend API key | resend.com/api-keys |
| `EMAIL_FROM` | Sender email | `VOID <noreply@yourdomain.com>` |
| `SENTRY_DSN` | Sentry DSN | sentry.io → Project Settings |
| `DARK_MODE_SALT` | Random salt | `openssl rand -base64 32` |

---

## 🏗️ Architecture

```
void-platform/
├── src/
│   ├── app/
│   │   ├── (app)/          # Authenticated app routes
│   │   │   ├── feed/       # Social feed
│   │   │   ├── marketplace/ # Tool marketplace
│   │   │   ├── knowledge/  # Q&A knowledge base
│   │   │   ├── bounties/   # Bounty board
│   │   │   ├── guilds/     # Tech guilds
│   │   │   ├── hackathons/ # Hackathon rooms
│   │   │   ├── leaderboard/ # Reputation leaderboard
│   │   │   ├── profile/    # User profiles
│   │   │   ├── settings/   # Account settings
│   │   │   ├── notifications/ # Notifications
│   │   │   └── messages/   # Direct messages
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # NextAuth
│   │   │   ├── posts/      # Feed posts
│   │   │   ├── marketplace/ # Listings & transactions
│   │   │   ├── knowledge/  # Questions & answers
│   │   │   ├── bounties/   # Bounties
│   │   │   ├── guilds/     # Guilds
│   │   │   ├── users/      # User management
│   │   │   ├── dark-mode/  # Anonymous sessions
│   │   │   ├── notifications/ # Notifications
│   │   │   ├── upload/     # File uploads
│   │   │   └── stripe/     # Payment webhooks
│   │   └── auth/           # Auth pages
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   └── layout/         # Navbar, sidebar
│   ├── lib/
│   │   ├── auth.ts         # NextAuth config
│   │   ├── prisma.ts       # Database client
│   │   ├── redis.ts        # Redis client
│   │   ├── stripe.ts       # Stripe helpers
│   │   ├── r2.ts           # Cloudflare R2
│   │   ├── email.ts        # Resend email
│   │   ├── reputation.ts   # Reputation system
│   │   └── dark-mode.ts    # Anonymous sessions
│   └── hooks/              # React hooks
├── prisma/
│   └── schema.prisma       # Complete database schema
└── void-cli/               # CLI tool (separate package)
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Monaco Editor
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis (Upstash)
- **Auth**: NextAuth.js (GitHub, Google, Magic Link)
- **Payments**: Stripe + Stripe Connect
- **Storage**: Cloudflare R2
- **Email**: Resend
- **Monitoring**: Sentry

---

## 🖥️ CLI Tool

```bash
npm install -g void-cli

void login                    # Sign in
void post "my thought"        # Post to feed
void search rust tools        # Search platform
void ask "how do I fix X?"    # Ask a question
void dark                     # Enable anonymous mode
void feed                     # Browse feed
void market                   # Browse marketplace
void profile username         # View profile
void whoami                   # Current user info
void logout                   # Sign out
```

---

## 🔒 Security Features

- **Dark Mode**: Cryptographically isolated anonymous sessions. SHA-256 HMAC hash links sessions to users — never stored in plaintext. Platform cannot link dark mode activity to real accounts.
- **Escrow Payments**: Stripe manual capture holds funds until delivery confirmed
- **Dead Man's Switch**: Auto-refund if seller disappears for 7 days
- **E2E Encrypted DMs**: Signal protocol, keys stored only on device
- **WCAG AA**: Full accessibility compliance

---

## 📊 Reputation Levels

| Level | Points | Color |
|-------|--------|-------|
| NEWCOMER | 0+ | Gray |
| BUILDER | 100+ | Green |
| HACKER | 500+ | Cyan |
| ARCHITECT | 2000+ | Purple |
| LEGEND | 10000+ | Gold |

Reputation is exportable as a signed JSON credential portable to other platforms.

---

## License

MIT — Built by builders, for builders.
