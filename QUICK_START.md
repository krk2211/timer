# Quick Deployment Steps

## You have successfully prepared your repository! ✅

Your code is now ready to deploy. Here's what to do next:

### Step 1: Push to GitHub (public repo)

```bash
cd "/Users/kiran/Downloads/timer 3"

# Switch to main branch and sync with your latest commit
git checkout main
git merge backup  # Merge changes from backup branch
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to: https://github.com/krk2211/timer/settings/pages
2. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
3. Under "Custom domain": Enter `kavyakiran.life`
4. Check "Enforce HTTPS"

### Step 3: Configure DNS

Update your domain registrar's DNS settings:

**Option A: CNAME (Recommended)**
```
Type: CNAME
Name: @ (or leave blank)
Value: krk2211.github.io
TTL: 3600
```

**Option B: A Records**
```
Type: A
Values:
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153
```

Wait 10-30 minutes for DNS to propagate.

### Step 4: Deploy Cloudflare Worker

The local `worker/wrangler.toml` is already configured with your D1 database ID.

```bash
cd worker

# Login to Cloudflare (if not already logged in)
wrangler login

# Initialize database tables
wrangler d1 execute wedding-rsvps --file schema.sql

# Deploy the worker
wrangler deploy
```

### Step 5: Configure Worker Route in Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com
2. Select your domain: `kavyakiran.life`
3. Navigate to: **Workers and Pages** → **Routes**
4. Create new route:
   - Pattern: `wedding-rsvp.kavyakiran.life/*`
   - Worker: `wedding-rsvp`
5. Save

### Step 6: Verify Everything Works

```bash
# Test frontend
curl -I https://kavyakiran.life

# Test RSVP API (should return empty array initially)
curl https://wedding-rsvp.kavyakiran.life/rsvps

# View database
wrangler d1 execute wedding-rsvps --command "SELECT * FROM rsvps"
```

## What's Protected ✅

Your repository is safe! The `.gitignore` protects:
- ❌ `worker/wrangler.toml` - Local config with database ID (NOT committed)
- ❌ `.wrangler/` - Build artifacts
- ❌ `.env` files

What's committed (safe):
- ✅ `worker/wrangler.toml.example` - Template for others
- ✅ `worker/rsvp-worker.js` - Backend code
- ✅ `worker/schema.sql` - Database schema
- ✅ HTML, CSS, JS - Frontend code
- ✅ All documentation

## Database ID Reference

Your Cloudflare D1 Database:
- **Database ID**: `9aeeadf8-0d0c-4b28-9094-bd21d4941af1`
- **Database Name**: `wedding-rsvps`
- **Region**: Auto

## Need Help?

See the detailed guides:
- **Full Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Security Info**: [SECURITY.md](./SECURITY.md)
- **Project Overview**: [README.md](./README.md)

---

**Your site will be live at: https://kavyakiran.life**
