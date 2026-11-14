# Pabitra Lenka - Portfolio Clone with Admin Panel & Supabase Database

A complete, high-fidelity clone of [pabitralenka.in](https://pabitralenka.in/) configured for instant deployment on [Vercel](https://vercel.com/) with a built-in **Admin Dashboard** and **Supabase Database** integration.

---

## 🛠️ Key Features

- **Exact Visual & Functional Fidelity**: Full replication of all 6 public routes (Homepage, Web Developer, AI/ML Engineer, Python Developer, Data Scientist, Photographer).
- **Admin Dashboard (`/admin/`)**: Manage, edit, add, reorder, and delete all public page content via a passcode-protected admin portal.
- **Supabase Cloud Database Ready**: Supports seamless synchronization with Supabase PostgreSQL database using `@supabase/supabase-js`.
- **Zero-Config Dual-Mode**:
  - **Local Storage Mode**: Works immediately out-of-the-box without needing any database setup.
  - **Supabase Cloud Mode**: Simply paste your Supabase URL & Anon Key into the admin dashboard to enable real-time cloud data sync across devices.
- **Pre-configured Vercel Deployment**: Includes `vercel.json` with cache optimizations, security headers, and the official `vercel` CLI dependency.

---

## 📁 Project Structure

```text
├── index.html                   # Homepage
├── admin/                       # Admin Dashboard (/admin/)
│   ├── index.html               # Admin portal interface
│   ├── admin.css                # Dark theme admin styling
│   └── admin.js                 # CRUD management & Supabase client logic
├── components/                  # Shared components & data store
│   ├── dataStore.js             # Unified Supabase + LocalStorage data layer
│   ├── friendsData.js           # Collaborators dataset
│   ├── techData.js              # Tech stack dataset
│   └── ...                      # Interactive canvas & physics components
├── supabase_schema.sql          # Complete Supabase SQL setup & seed data script
├── vercel.json                  # Vercel deployment routing & caching headers
├── package.json                 # Project configuration (Vercel & Supabase SDK)
├── .vercelignore                # Vercel deployment exclusions
├── .gitignore                   # Git exclusions
│
├── fonts/                       # Onest Latin & Extended fonts
├── vendor/                      # External libraries (Lenis smooth scroll)
├── web-developer/               # Web Developer route & media assets
├── ai-ml-engineer/              # AI/ML Engineer route & video demos
├── python-developer/            # Python Developer route & video demos
├── data-scientist/              # Data Scientist route & case study graphics
└── photographer/                # Photography route & photo gallery
```

---

## 🔐 Admin Dashboard Access

1. Open `/admin/` in your browser (e.g., `http://localhost:8080/admin/`).
2. Enter the default passcode: **`admin123`**.
3. You can edit:
   - **Profile & Hero**: Name, tagline, bio, social links, email, resume file.
   - **Web Developer Projects**: Add, Edit, Delete, Reorder projects.
   - **AI/ML Engineer Apps**: Manage apps, metrics, icons, and videos.
   - **Python Projects**: Manage microservices, API tools, and demo media.
   - **Photography Gallery**: Manage photo cards, categories, and thumbnail/full image URLs.
   - **Collaborators**: Manage "Better Together" cards.
   - **Tech Stack**: Manage skill items in the LogoLoop ticker.
   - **Admin Passcode**: Change your admin passcode in the Supabase/Settings tab.

---

## ⚡ Connecting Supabase (Optional)

1. Create a free project at [supabase.com](https://supabase.com/).
2. In the Supabase Dashboard, go to **SQL Editor** &rarr; **New Query**.
3. Paste the contents of `supabase_schema.sql` (or click "Copy SQL Script" directly in the Admin Panel) and click **RUN**.
4. In your Supabase Dashboard, go to **Project Settings** &rarr; **API** and copy:
   - **Project URL**
   - **anon public key**
5. Open your portfolio's `/admin/` page, go to the **Supabase Database** tab, paste your credentials, and click **Save Config**.
6. Click **"Push All Local Data to Supabase"** to populate your database. Public pages will now read from your live Supabase database!

---

## 🚀 Deployment to Vercel

### Option 1: Via Vercel CLI (Quickest)

```bash
npx vercel login
npm run deploy:prod
```

### Option 2: Via GitHub

1. Initialize Git and commit:
   ```bash
   git init
   git add .
   git commit -m "Complete portfolio clone with Admin Panel and Supabase"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/new), import your repository and click **Deploy**.

---

## 💻 Local Development

```bash
npm run serve
# or
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) for the public site, or [http://localhost:8080/admin/](http://localhost:8080/admin/) for the admin dashboard.
