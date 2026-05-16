# AirdropIndia · CryptoTaxIndia

Two crypto tools for India, living in one Next.js site.

- **AirdropIndia** (`/airdrops`) — curated crypto airdrops with chain filter, search, step-by-step claim guides, public submission form, and an email alert list.
- **CryptoTaxIndia** (`/tax`) — Indian crypto tax calculator implementing Section 115BBH (30% flat) + Section 194S (1% TDS) + 4% Health & Education Cess, with downloadable PDF, AI explainer in Hinglish/English, and saved history for logged-in users.
- **Blog** (`/blog`) — SEO-targeted long-form guides on Indian crypto tax + airdrops.

Tech: Next.js 14 (App Router) · TypeScript · TailwindCSS · Three.js / @react-three/fiber · Framer Motion · Supabase (DB + Auth) · Groq (AI) · Resend (email) · @react-pdf/renderer · Vercel.

---

## 1. Local setup

```bash
npm install
cp .env.example .env.local   # fill in the keys you have (see below)
npm run dev
```

Open <http://localhost:3000>. The site works in "demo mode" even without keys — airdrops use seed data, calculator runs locally, login & email signup show friendly errors.

### Required env vars

| Key | Where to get it | Required for |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | supabase.com → project → Settings → API | Auth + persistence |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same place | Auth + persistence |
| `SUPABASE_SERVICE_ROLE_KEY` | same place (⚠️ server-only, never expose) | Admin writes, cron, sitemap |
| `GROQ_API_KEY` | console.groq.com → API Keys | AI tax explanations + airdrop guide generation |
| `RESEND_API_KEY` | resend.com → API Keys | Email subscribe / new airdrop / weekly digest |
| `RESEND_FROM_EMAIL` | a verified Resend domain (e.g. `alerts@airdropindia.in`) | Email sender |
| `ADMIN_EMAIL` or `ADMIN_EMAILS` | your email — whitelisted for `/admin` | Admin panel access |
| `CRON_SECRET` | any random string (`openssl rand -hex 24`) | `/api/cron/*` auth |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for dev, your Vercel URL for prod | Sitemap, emails, OAuth redirects |

---

## 2. Supabase setup

1. Create a project at <https://supabase.com>. Region: **Asia Pacific (Mumbai)** ideally.
2. **SQL Editor → New query** → paste `supabase/migrations/0001_init.sql` → Run.
3. (Optional) Paste `supabase/migrations/0002_seed_airdrops.sql` → Run.
4. **Authentication → Providers → Google** → enable. You need a Google OAuth client first — see below.
5. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (dev) or your prod URL.
   - Redirect URLs: `http://localhost:3000/auth/callback`, `https://<vercel-url>/auth/callback`.

### Google OAuth (5 min, one time)

1. <https://console.cloud.google.com> → new project named `AirdropIndia`.
2. **APIs & Services → OAuth consent screen** → External → fill basics → Save → **Publish App**.
3. **Credentials → + Create Credentials → OAuth client ID → Web application**.
4. **Authorized JavaScript origins**: `http://localhost:3000`, `https://<your-supabase-ref>.supabase.co`, `https://<your-vercel-domain>`.
5. **Authorized redirect URI**: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`.
6. Copy Client ID + Secret → paste into Supabase Auth Providers → Google.

---

## 3. Deploy to Vercel

1. Push to GitHub (already linked).
2. <https://vercel.com/new> → Import the repo.
3. Add all env vars from `.env.example` in Vercel project settings.
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL.
5. Deploy.

Vercel auto-picks up `vercel.json` for the Monday-04:00-UTC weekly digest cron.

---

## 4. Google Search Console (SEO)

After deploy:

1. <https://search.google.com/search-console> → Add Property → URL prefix → your domain.
2. Verify ownership (HTML meta tag is easiest — add it to `<head>` in `src/app/layout.tsx`).
3. Sitemaps → add `https://yourdomain.com/sitemap.xml`.
4. Repeat at <https://www.bing.com/webmasters>.

Indexing takes 2–4 weeks. Don't panic.

---

## 5. Project structure

```
src/
├─ app/
│  ├─ page.tsx                  # landing
│  ├─ airdrops/                 # AirdropIndia (list, [slug], submit)
│  ├─ tax/                      # CryptoTaxIndia (calc, examples, history)
│  ├─ blog/                     # blog index + [slug]
│  ├─ admin/                    # admin panel
│  ├─ auth/                     # login + callback + signout
│  ├─ dashboard/                # user dashboard
│  ├─ api/                      # routes (subscribe, tax/save, ai/*, cron/*, admin/*)
│  ├─ sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx
│  └─ layout.tsx                # root layout (3D bg + navbar + footer)
├─ components/{three,airdrops,tax,shared,ui}/
├─ emails/                      # React Email templates
└─ lib/                         # supabase clients, tax math, groq, resend, blog, admin
content/posts/                  # markdown blog seeds (7 posts)
supabase/migrations/            # SQL migrations
```

---

## 6. Tax math reference

Implemented in `src/lib/tax/calculator.ts`. Pure function — no side effects, fully testable.

```
totalBuy     = buyPrice × quantity
totalSell    = sellPrice × quantity
profitLoss   = totalSell − totalBuy
taxableGain  = max(0, profitLoss)                # losses can't offset
baseTax      = 30% × taxableGain                 # Section 115BBH
surcharge    = baseTax × surchargeRate           # optional 10/15/25/37%
cess         = 4% × (baseTax + surcharge)
totalTax     = baseTax + surcharge + cess        # = 31.2% (no surcharge)
tdsThreshold = 50_000 (specified person) | 10_000
tds          = 1% × totalSell  if yearlyTransferTotal > tdsThreshold else 0
netCash      = totalSell − totalTax − tds
```

Reference: incometaxindia.gov.in — Finance Act 2022, Sections 115BBH and 194S.

This is **informational only**. Always validate with a Chartered Accountant.

---

## 7. Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
npm run format     # prettier --write
```

---

## 8. Disclaimer

Free educational tool. Not tax or financial advice. Crypto is high-risk; airdrops can be scams. Always verify official URLs and consult a CA before filing.
