# Cloudflare Pages Deployment Guide

Use Cloudflare Pages for the static site and the existing Worker for RSVPs. Cloudflare stores tokens and secrets; nothing sensitive needs to be in your repo.

## 📋 What to Commit
- `index.html`, `css/`, `js/`, `img/`
- `CNAME` (`kavyakiran.life`)
- `.gitignore`
- `worker/rsvp-worker.js`, `worker/schema.sql`
- `worker/wrangler.toml.example` (template only)

## ❌ What NOT to Commit
- `worker/wrangler.toml` (ignored; keep local)
- `worker/node_modules/`, `.wrangler/`
- Any `.env` or log files

## 🚀 Steps (Cloudflare Pages)
1) **Init repo (if needed)**
```bash
cd "/Users/kiran/Downloads/timer 3"
git init
```

2) **Use template for worker config (safer)**
```bash
cp worker/wrangler.toml.example worker/wrangler.toml
# fill in your DB id locally (not committed)
```

3) **Add & commit**
```bash
git add .
git status   # confirm worker/wrangler.toml is NOT listed
git commit -m "Deploy to Cloudflare Pages"
```

4) **Push to your repo** (GitHub, GitLab, etc.)
```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

5) **Create Cloudflare Pages project**
- In Cloudflare Dashboard → Pages → **Create project**
- Connect the repo you just pushed
- **Framework preset:** None
- **Build command:** leave empty
- **Build output directory:** `.` (root)
- **Environment variables:** not required for static pages
- Deploy

6) **Custom domain**
- In Pages project → **Custom domains** → add `kavyakiran.life`
- Cloudflare will give DNS records; apply them in DNS (usually a CNAME to `your-project.pages.dev`)
- Enable **Always use HTTPS**

7) **Worker (RSVP API)**
- Already deployed at `https://wedding-rsvp.kiraninqatar.workers.dev`
- CORS is set to `https://kavyakiran.life` in `wrangler.toml`
- If you want to keep CORS/DB IDs out of git, set them as Environment Variables in the Worker:
  - In Worker settings → Variables → add `ALLOWED_ORIGIN=https://kavyakiran.life`
  - D1 binding: add the D1 database to the Worker (already bound as `DB`)
- Redeploy if you change env vars:
```bash
cd worker
wrangler deploy
```

8) **Verify**
- Visit `https://kavyakiran.life`
- Submit RSVP; it should reach D1 via the Worker

## 📝 Notes
- `window.RSVP_WORKER_URL` in `index.html` points to the Worker URL (keeps secrets server-side).
- Database ID is an identifier, not a secret; Cloudflare auth protects access.
- Keep `worker/wrangler.toml` out of git; use the `.example` file in the repo.

## ✅ Checklist
- [x] `.gitignore` ignores `worker/wrangler.toml`
- [x] `wrangler.toml.example` in repo
- [ ] Repo pushed
- [ ] Cloudflare Pages project created & deployed
- [ ] Custom domain attached and DNS updated
- [ ] Worker env vars set (if you moved them to dashboard)
- [ ] RSVP form tested on `https://kavyakiran.life`

