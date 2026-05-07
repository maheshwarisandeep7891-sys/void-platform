# VOID Platform

<div align="center">

**The internet's home for people who actually build things.**

[![Live](https://img.shields.io/badge/Live-void--platform.vercel.app-8b5cf6?style=for-the-badge&logo=vercel)](https://void-platform.vercel.app)
[![Developers](https://img.shields.io/badge/Developers-500%2B-34d399?style=for-the-badge)](https://void-platform.vercel.app)
[![Posts](https://img.shields.io/badge/Posts-1700%2B-38bdf8?style=for-the-badge)](https://void-platform.vercel.app/feed)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)

</div>

---

## 🖤 What is VOID?

VOID is a platform built exclusively for developers. Social network + marketplace + knowledge base. No algorithm. No engagement bait. Just builders.

**[→ Try it live: void-platform.vercel.app](https://void-platform.vercel.app)**

---

## ✨ Features

### 🖤 Dark Mode — Anonymous Posting
One click → completely anonymous identity. Random handle every session (`ghost_0x7f`). Zero link to your real account. Ask anything without reputation damage.

### 🛒 Developer Marketplace
Buy and sell unused developer resources with built-in escrow:
- GitHub Copilot / JetBrains seats
- OpenAI / Anthropic API credits  
- GPU access (rent by the hour)
- Side projects with revenue
- Software licenses

No Stripe needed. Auto-refund if seller disappears after 7 days.

### 📚 Knowledge Base
Stack Overflow done right:
- Anonymous questions supported
- "Still works" community verification button
- Voting, accepted answers, Markdown support
- No hostile moderation

### 💰 Bounties
Post a coding problem with a reward. Community solves it. Escrow-backed payments. Anonymous submissions supported.

### 🏆 Reputation System
`NEWCOMER → BUILDER → HACKER → ARCHITECT → LEGEND`

Earned through real contributions. Exportable as a signed JSON credential for your resume.

### 🏰 Guilds & Hackathons
Communities organized by tech stack. 48-72h hackathon rooms with live countdown timers.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL (Neon) |
| **Auth** | Custom JWT OAuth (GitHub) — no NextAuth |
| **Caching** | Redis (Upstash) |
| **Deployment** | Vercel |
| **Rate Limiting** | Edge middleware |

---

## 🚀 Getting Started

```bash
git clone https://github.com/maheshwarisandeep7891-sys/void-platform
cd void-platform
npm install
cp .env.example .env.local
# Fill in your env vars
npm run dev
```

### Required Environment Variables

```env
DATABASE_URL=          # PostgreSQL connection string
AUTH_SECRET=           # JWT secret (32+ chars)
AUTH_GITHUB_ID=        # GitHub OAuth App Client ID
AUTH_GITHUB_SECRET=    # GitHub OAuth App Client Secret
NEXTAUTH_URL=          # Your deployment URL
REDIS_URL=             # Upstash Redis URL (optional)
```

---

## 📊 Live Stats

| Metric | Count |
|---|---|
| Developers | 500+ |
| Posts | 1,700+ |
| Bounties | 12 open |
| Guilds | 5 |
| Marketplace listings | 20+ |

---

## 🗺 Roadmap

- [ ] Real-time WebSocket messaging
- [ ] Mobile apps (iOS + Android)
- [ ] Email notifications
- [ ] Stripe integration for paid bounties
- [ ] API for third-party integrations
- [ ] Browser extension

---

## 🤝 Contributing

Contributions welcome. Open an issue or PR.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**[→ Join VOID — Free, GitHub login, 30 seconds](https://void-platform.vercel.app)**

Built with ❤️ for developers who actually ship things.

</div>
