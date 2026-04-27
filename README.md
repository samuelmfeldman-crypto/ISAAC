# ISAAC — Inphinity Sports Athletics Advisory Companion

AI-powered NIL value calculator and sports agent for athletes. Built with Next.js 14, Supabase, and Claude AI.

---

## Deploy to Netlify (5 minutes)

### Step 1 — Push to GitHub
1. Create a new GitHub repo at github.com
2. In your `isaac-2` folder, run:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/isaac-2.git
   git push -u origin main
   ```

### Step 2 — Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Connect your GitHub account and select the `isaac-2` repo
3. Build settings are auto-detected from `netlify.toml` — no changes needed
4. Click **Deploy site**

### Step 3 — Add Environment Variables
In Netlify: **Site settings → Environment variables → Add variable**

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secret) |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `NEXT_PUBLIC_APP_URL` | Your Netlify URL, e.g. `https://isaac-app.netlify.app` |

### Step 4 — Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `schema.sql` → click **Run**
3. That creates all tables and seeds state NIL rules

---

## Seeing Your Data (Backend)

### Sign-ups & Usage — Supabase Dashboard
Go to [supabase.com](https://supabase.com) → your project → **Table Editor**

| Table | What you'll see |
|---|---|
| `athletes` | Every person who submitted a profile — name, email, sport, location, school |
| `valuations` | Every NIL calculation run — tier, score breakdown, deal values |
| `chat_history` | Every message sent to ISAAC — full conversation logs |
| `deal_opportunities` | Deal pipeline if athletes save opportunities |

**To export a CSV**: In any table, click the download icon (top right of the table view).

### In-App Admin Dashboard
Visit `https://your-site.netlify.app/admin` to see:
- Total sign-up count
- Total valuations run
- Total chat messages
- Breakdown by sport and state
- Recent sign-ups list with email and location

> **Note:** Before making this public, add password protection. In Netlify: **Site settings → Access control → Password protection**.

### Netlify Analytics (optional, $9/mo)
In your Netlify dashboard → **Analytics** tab — shows page views, unique visitors, referrers, and top pages. Worth adding once you have real traffic.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL via Supabase |
| AI Agent | Claude API (claude-opus-4-6) |
| Deployment | Netlify + @netlify/plugin-nextjs |

---

## Local Development

```bash
cd isaac-2
npm install
cp .env.example .env.local
# fill in your keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## NIL Compliance Note

NIL rules for high school athletes vary by state. This tool is for educational purposes only. Always verify deal terms and eligibility with your school's athletic department before signing any NIL agreement.
