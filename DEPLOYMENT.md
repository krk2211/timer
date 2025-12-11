# Wedding Website - Deployment Guide

## Architecture
- **Frontend**: GitHub Pages (HTML, CSS, JS) → `kavyakiran.life`
- **Backend**: Cloudflare Workers (RSVP API) → `wedding-rsvp.kavyakiran.life`
- **Database**: Cloudflare D1 (SQLite) → Database ID: `9aeeadf8-0d0c-4b28-9094-bd21d4941af1`

## 📋 What to Commit to GitHub
✅ Safe to commit:
- `index.html`, `css/`, `js/`, `img/` (frontend files)
- `CNAME` (`kavyakiran.life`)
- `worker/rsvp-worker.js` (backend code)
- `worker/schema.sql` (database schema)
- `worker/wrangler.toml.example` (template)
- `.gitignore`, `README.md`, `DEPLOYMENT.md`

❌ Never commit (protected by `.gitignore`):
- `worker/wrangler.toml` (contains database ID and secrets)
- `.wrangler/` directory (local build artifacts)
- `node_modules/`, `.env` files

❌ Never commit (protected by `.gitignore`):
- `worker/wrangler.toml` (contains database ID and secrets)
- `.wrangler/` directory (local build artifacts)
- `node_modules/`, `.env` files

## 🚀 Step-by-Step Deployment

### Phase 1: Initialize Git Repository

```bash
cd "/Users/kiran/Downloads/timer 3"
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"
git add .
git status   # Verify worker/wrangler.toml is NOT in the staging area
git commit -m "Initial commit: wedding website with Cloudflare Workers RSVP"
```

### Phase 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create repository: `timer` (or your preferred name)
3. Make it **Public** (required for free GitHub Pages)
4. Do NOT initialize with README (you already have files)
5. Click "Create repository"

### Phase 3: Push to GitHub

```bash
git remote add origin https://github.com/krk2211/timer.git
git branch -M main
git push -u origin main
```

### Phase 4: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
4. Under "Custom domain":
   - Enter: `kavyakiran.life`
   - Check "Enforce HTTPS"
5. Save

### Phase 5: Configure DNS for GitHub Pages

Update your DNS provider (where your domain is registered):

**Add CNAME record:**
```
Host/Name: @ (or leave blank)
Type: CNAME
Value: krk2211.github.io
TTL: 3600
```

Or add these A records instead:
```
Type: A
Values:
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153
```

Wait 10-30 minutes for DNS to propagate. Then verify:
```bash
nslookup kavyakiran.life
# Should resolve to GitHub Pages IP
```

### Phase 6: Configure Cloudflare Workers (Local)

⚠️ **IMPORTANT: This stays LOCAL only, never committed to GitHub**

1. Install Wrangler (if not already installed):
```bash
npm install -g @cloudflare/wrangler
```

2. Create local config from template:
```bash
cp worker/wrangler.toml.example worker/wrangler.toml
```

3. Edit `worker/wrangler.toml` locally:
```toml
name = "wedding-rsvp"
main = "rsvp-worker.js"
compatibility_date = "2024-01-01"
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID_HERE"

[env.production]
name = "wedding-rsvp"
route = "https://wedding-rsvp.kavyakiran.life/*"

[vars]
ALLOWED_ORIGIN = "https://kavyakiran.life"

[[d1_databases]]
binding = "DB"
database_name = "wedding-rsvps"
database_id = "9aeeadf8-0d0c-4b28-9094-bd21d4941af1"
```

4. Find your Cloudflare Account ID:
   - Go to Cloudflare Dashboard → Your Profile → API Tokens
   - Copy "Account ID"

### Phase 7: Deploy Cloudflare Worker

```bash
cd worker

# Authenticate with Cloudflare
wrangler login

# Initialize the D1 database (create tables)
wrangler d1 execute wedding-rsvps --file schema.sql

# Deploy the Worker
wrangler deploy
```

Your worker will be available at: `https://wedding-rsvp.kavyakiran.life/rsvps`

### Phase 8: Set Worker Routes in Cloudflare

1. Go to Cloudflare Dashboard
2. Select your domain (`kavyakiran.life`)
3. Go to **Workers and Pages** → **Routes**
4. Add route:
   - Pattern: `wedding-rsvp.kavyakiran.life/*`
   - Worker: `wedding-rsvp`

### Phase 9: Verify Deployment

Check frontend:
```bash
# Should load your website
curl -I https://kavyakiran.life
```

Check worker:
```bash
# Should return empty array initially
curl https://wedding-rsvp.kavyakiran.life/rsvps
```

Check database:
```bash
# View all RSVPs submitted
wrangler d1 execute wedding-rsvps --command "SELECT * FROM rsvps"
```

## 🔒 Security Checklist

- [x] `.gitignore` blocks `worker/wrangler.toml`
- [x] Database ID in local config only (not committed)
- [x] `wrangler.toml.example` is safe template
- [ ] GitHub repo is public (enable Pages)
- [ ] HTTPS enabled on GitHub Pages
- [ ] HTTPS enabled on Cloudflare Worker
- [ ] CORS restricted to `kavyakiran.life`
- [ ] D1 database credentials stored only in Cloudflare

## 📝 RSVP Integration

The frontend (`index.html`) is configured with:
```javascript
window.RSVP_WORKER_URL = "https://wedding-rsvp.kavyakiran.life";
```

The form will POST to the worker's `/rsvps` endpoint. Responses are stored in D1.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| GitHub Pages shows 404 | Ensure `index.html` is in repo root and GitHub Pages source is set to `main` |
| RSVP form not working | Check worker deployment: `wrangler deploy` |
| CORS errors | Verify `ALLOWED_ORIGIN` in `worker/wrangler.toml` matches your domain |
| Database errors | Check database exists: `wrangler d1 list` |
| DNS not resolving | Wait 30 min, then run: `nslookup kavyakiran.life` |

## 🔄 Updating Code

**To update the frontend:**
```bash
git add index.html css/ js/
git commit -m "Update website content"
git push
# GitHub Pages auto-deploys
```

**To update the worker:**
```bash
git add worker/rsvp-worker.js
git commit -m "Update RSVP worker logic"
git push
# Then redeploy locally:
cd worker && wrangler deploy
```

**To update the database schema:**
```bash
wrangler d1 execute wedding-rsvps --file worker/schema.sql
```

## 📊 Monitor RSVP Submissions

```bash
# View all RSVPs
wrangler d1 execute wedding-rsvps --command "SELECT * FROM rsvps ORDER BY submitted_at DESC"

# Export as JSON
wrangler d1 execute wedding-rsvps --command "SELECT * FROM rsvps" --json > rsvps.json

# Get count
wrangler d1 execute wedding-rsvps --command "SELECT COUNT(*) as total FROM rsvps"
```

