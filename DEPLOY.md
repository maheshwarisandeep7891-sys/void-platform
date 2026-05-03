# VOID — Complete Deployment Guide
## From zero to live in ~20 minutes

---

## STEP 1: Push to GitHub

```bash
# Create a new repo at https://github.com/new (name it "void-platform")
git remote add origin https://github.com/YOUR_USERNAME/void-platform.git
git branch -M main
git push -u origin main
```

---

## STEP 2: Set Up Supabase (Free PostgreSQL)

1. Go to **https://supabase.com** → Sign up → New project
2. Choose a name (e.g. `void-platform`) and a strong password
3. Wait ~2 minutes for provisioning
4. Go to **Project Settings → Database → Connection string**
5. Copy the **URI** — this is your `DATABASE_URL`
   - Replace `[YOUR-PASSWORD]` with your actual password
   - Example: `postgresql://postgres:mypassword@db.abcdef.supabase.co:5432/postgres`

---

## STEP 3: Set Up Upstash Redis (Free)

1. Go to **https://console.upstash.com** → Sign up → Create Database
2. Choose **Redis** → Select closest region → Create
3. Go to **Details** tab → Copy the **Redis URL** (starts with `rediss://`)
4. This is your `REDIS_URL`

---

## STEP 4: Set Up GitHub OAuth

1. Go to **https://github.com/settings/developers** → OAuth Apps → New OAuth App
2. Fill in:
   - **Application name**: VOID
   - **Homepage URL**: `https://void-platform.vercel.app` (update after deploy)
   - **Authorization callback URL**: `https://void-platform.vercel.app/api/auth/callback/github`
3. Click **Register application**
4. Copy **Client ID** → `GITHUB_CLIENT_ID`
5. Click **Generate a new client secret** → Copy → `GITHUB_CLIENT_SECRET`

---

## STEP 5: Deploy to Vercel (Free)

1. Go to **https://vercel.com/new**
2. Click **Import Git Repository** → Select your `void-platform` repo
3. Framework: **Next.js** (auto-detected)
4. Click **Environment Variables** and add ALL of these:

### Required Environment Variables

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://...` | From Supabase Step 2 |
| `REDIS_URL` | `rediss://...` | From Upstash Step 3 |
| `NEXTAUTH_SECRET` | (random string) | Run: `openssl rand -base64 32` or use any 32+ char string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel URL (set after first deploy) |
| `GITHUB_CLIENT_ID` | (from Step 4) | |
| `GITHUB_CLIENT_SECRET` | (from Step 4) | |
| `DARK_MODE_SALT` | (random string) | Any 32+ char random string |

### Optional (add later for full features)

| Key | Value | Where to get |
|-----|-------|-------------|
| `GOOGLE_CLIENT_ID` | ... | console.cloud.google.com |
| `GOOGLE_CLIENT_SECRET` | ... | console.cloud.google.com |
| `RESEND_API_KEY` | `re_...` | resend.com/api-keys |
| `EMAIL_FROM` | `VOID <noreply@yourdomain.com>` | |
| `CLOUDFLARE_ACCOUNT_ID` | ... | dash.cloudflare.com |
| `R2_ACCESS_KEY_ID` | ... | dash.cloudflare.com → R2 |
| `R2_SECRET_ACCESS_KEY` | ... | dash.cloudflare.com → R2 |
| `R2_BUCKET_NAME` | `void-platform` | |
| `R2_PUBLIC_URL` | `https://pub-xxx.r2.dev` | |
| `SENTRY_DSN` | `https://...` | sentry.io |
| `CRON_SECRET` | (random string) | Protects cron endpoint |

5. Click **Deploy**

---

## STEP 6: Run Database Migrations

After first deploy, run migrations via Vercel CLI or Supabase SQL editor:

### Option A: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel env pull .env.local  # pulls env vars locally
npx prisma db push          # pushes schema to Supabase
```

### Option B: Via Supabase SQL Editor
1. Go to Supabase → SQL Editor
2. Run the generated migration SQL from `prisma migrate dev --create-only`

---

## STEP 7: Update OAuth Callback URLs

After Vercel gives you a URL (e.g. `https://void-platform-abc123.vercel.app`):

1. **GitHub**: Go back to your OAuth app → Update Homepage URL and Callback URL
2. **Vercel**: Update `NEXTAUTH_URL` env var to your actual URL → Redeploy

---

## STEP 8: Set Up Custom Domain (Optional)

1. Vercel Dashboard → Your project → Settings → Domains
2. Add your domain (e.g. `void.dev`)
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to `https://void.dev`
5. Update GitHub OAuth callback URL

---

## STEP 9: Install the CLI

```bash
npm install -g void-cli
void login --token YOUR_API_TOKEN
void whoami
```

---

## Your Platform is Live! 🚀

### What works out of the box (no extra keys needed):
- ✅ Full social feed (posts, snippets, drops, bounties, questions)
- ✅ Marketplace with internal escrow payments
- ✅ Knowledge base with voting and accepted answers
- ✅ Dark mode (anonymous sessions)
- ✅ Guilds and hackathon rooms
- ✅ Reputation system with levels
- ✅ Notifications
- ✅ Direct messages
- ✅ Leaderboard
- ✅ GitHub OAuth login
- ✅ CLI tool

### Requires additional setup:
- 📧 Email (magic links) → Add `RESEND_API_KEY`
- 🖼️ File uploads → Add Cloudflare R2 credentials
- 🔍 Full-text search → Add Meilisearch
- 📊 Error tracking → Add `SENTRY_DSN`
- 🌐 Google login → Add Google OAuth credentials

---

## Troubleshooting

**Build fails with Prisma error:**
```bash
npx prisma generate
npx prisma db push
```

**Auth not working:**
- Check `NEXTAUTH_URL` matches your actual deployment URL exactly
- Check GitHub OAuth callback URL matches

**Database connection fails:**
- Verify `DATABASE_URL` is correct in Vercel env vars
- Check Supabase project is not paused (free tier pauses after 1 week of inactivity)

**Redis not connecting:**
- Redis features degrade gracefully — app still works without Redis
- Check `REDIS_URL` format: must start with `rediss://`
