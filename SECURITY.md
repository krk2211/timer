# Security Guide

## 🔐 What's Safe vs. Sensitive

### ✅ **SAFE to Commit:**
- `worker/rsvp-worker.js` - Your worker code (public)
- `worker/schema.sql` - Database schema (public)
- `worker/wrangler.toml.example` - Template file (no real IDs)
- `index.html`, `css/`, `js/`, `img/` - All public website files

### ⚠️ **Keep Private (default now):**
- `worker/wrangler.toml` - Contains `database_id` (identifier only, but kept local)

### 🔒 **NEVER Commit:**
- `~/.wrangler/config/default.toml` - Contains your API tokens (stored locally)
- `.wrangler/` folder - Build artifacts (already in .gitignore)
- Any `.env` files with secrets

## 🛡️ How Cloudflare Security Works

### API Tokens & Authentication
- **Where stored**: `~/.wrangler/config/default.toml` (your home directory)
- **Status**: ✅ NOT in repository (protected by .gitignore)
- **How it works**: When you run `wrangler login`, Cloudflare stores OAuth tokens locally
- **Security**: These tokens are never in your code repository

### Database ID
- **What it is**: A unique identifier for your D1 database (like `9aeeadf8-0d0c-4b28-9094-bd21d4941af1`)
- **Is it secret?**: No, it's a public identifier, not a credential
- **Can someone access your DB with it?**: No! Access is protected by:
  1. Cloudflare's authentication system (requires your account)
  2. Worker bindings (only your deployed worker can access it)
  3. CORS restrictions (only your domain can call the worker)

### Why Database ID is Relatively Safe
- It's like a database name - needed for the worker to connect
- Without your Cloudflare account credentials, it's useless
- Even if someone knows the ID, they can't access your database without:
  - Your Cloudflare account access
  - Deploying a worker with proper bindings
  - Your account's API tokens

## 🔧 Security Options

### Default approach now
- `worker/wrangler.toml` is ignored by git.
- `worker/wrangler.toml.example` is committed for reference.
- When deploying, copy the example locally and fill in your DB id.

### Optional: If you do commit wrangler.toml
- It's still safe (DB id is not a credential), but keep it private if possible.

## ✅ Current Security Status

Your setup is **SECURE** because:

1. ✅ **API tokens are NOT in repository**
   - Stored in `~/.wrangler/config/` (not tracked by git)
   - Protected by Cloudflare OAuth

2. ✅ **Sensitive build files are ignored**
   - `.wrangler/` folder is in .gitignore
   - Log files are ignored

3. ✅ **Database access is protected**
   - Requires Cloudflare account authentication
   - Worker bindings restrict access
   - CORS limits which domains can call your API

4. ⚠️ **Database ID is visible** (but not a security risk)
   - It's an identifier, not a credential
   - Cannot be used without your Cloudflare account

## 🚨 If You Want Maximum Security

If you're still concerned, you can:

1. **Add wrangler.toml to .gitignore:**
   ```bash
   echo "worker/wrangler.toml" >> .gitignore
   ```

2. **Use Cloudflare Secrets** (for truly sensitive values):
   ```bash
   wrangler secret put DATABASE_ID
   # Then reference it in code as env.DATABASE_ID
   ```

3. **Use Environment Variables** in GitHub Actions (if using CI/CD)

## 📝 Recommendation

**For your wedding website**: The current setup is **secure enough**. The database ID is not a secret, and Cloudflare's authentication protects your database. However, if you want extra peace of mind, you can add `worker/wrangler.toml` to `.gitignore` and use the `.example` file instead.

## 🔍 Verify Nothing Sensitive is Committed

Before pushing to GitHub, check:

```bash
# Check what will be committed
git status

# Search for potential secrets (API keys, tokens, etc.)
git diff --cached | grep -i "token\|secret\|key\|password"

# Verify .wrangler is ignored
git check-ignore .wrangler/
```

If `.wrangler` shows as ignored, you're good! ✅

