# Kavya & Kiran - Wedding Website

A beautiful, responsive wedding website with countdown timer, event timeline, gallery, travel information, and an RSVP system powered by Cloudflare Workers and D1 SQLite database.

**Live at:** [kavyakiran.life](https://kavyakiran.life)

## Features

✨ **Frontend**
- Responsive design with smooth animations
- Real-time countdown timer to wedding date (Feb 6, 2026)
- Event timeline with all wedding events
- Photo gallery (dynamically loaded)
- Travel & accommodation guide
- Music toggle with ambient background
- Mobile-optimized navigation

🔌 **Backend**
- Serverless RSVP API via Cloudflare Workers
- SQLite database (D1) for storing RSVPs
- CORS-protected endpoints
- Form validation

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Backend**: Cloudflare Workers (JavaScript)
- **Database**: Cloudflare D1 (SQLite)
- **Hosting**: GitHub Pages (frontend) + Cloudflare Workers (backend)
- **Domain**: Custom domain via CNAME (kavyakiran.life)

## Project Structure

```
.
├── index.html              # Main website
├── css/
│   └── styles.css         # All styling
├── js/
│   └── script.js          # Frontend logic & RSVP form
├── img/                    # Images and assets
├── CNAME                  # GitHub Pages custom domain
├── worker/
│   ├── rsvp-worker.js     # Cloudflare Worker code
│   ├── schema.sql         # D1 database schema
│   ├── wrangler.toml      # Worker config (local only, not committed)
│   └── wrangler.toml.example  # Template for wrangler.toml
├── DEPLOYMENT.md          # Detailed deployment guide
├── SECURITY.md            # Security policies
└── README.md             # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- Wrangler CLI: `npm install -g @cloudflare/wrangler`
- GitHub account
- Cloudflare account with Workers enabled

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/krk2211/timer.git
   cd timer
   ```

2. **View website locally**
   - Open `index.html` in browser, or
   - Use a local server: `npx http-server`

3. **Configure Cloudflare Worker (local only)**
   ```bash
   cp worker/wrangler.toml.example worker/wrangler.toml
   # Edit wrangler.toml with your Cloudflare Account ID and Database ID
   ```

4. **Deploy worker**
   ```bash
   cd worker
   wrangler login
   wrangler d1 execute wedding-rsvps --file schema.sql  # Initialize DB
   wrangler deploy
   ```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions:

**TL;DR:**
1. Push to GitHub (public repo)
2. Enable GitHub Pages with custom domain `kavyakiran.life`
3. Configure DNS CNAME: `@ → krk2211.github.io`
4. Deploy Worker locally: `wrangler deploy`
5. Configure Worker route in Cloudflare

## RSVP System

### Database Schema
```sql
CREATE TABLE rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  guests TEXT NOT NULL,
  events TEXT NOT NULL,
  message TEXT,
  submitted_at TEXT NOT NULL
);
```

### API Endpoints

**GET /rsvps** - List all RSVPs (admin)
```bash
curl https://wedding-rsvp.kavyakiran.life/rsvps
```

**POST /rsvps** - Submit RSVP
```bash
curl -X POST https://wedding-rsvp.kavyakiran.life/rsvps \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "guests": "2",
    "events": ["sangeet", "wedding"],
    "message": "Can't wait!"
  }'
```

### Monitor RSVPs
```bash
# View all RSVPs
wrangler d1 execute wedding-rsvps --command "SELECT * FROM rsvps ORDER BY submitted_at DESC"

# Export as JSON
wrangler d1 execute wedding-rsvps --command "SELECT * FROM rsvps" --json > rsvps-export.json

# Get statistics
wrangler d1 execute wedding-rsvps --command "SELECT COUNT(*) as total, SUM(CAST(guests AS INTEGER)) as total_guests FROM rsvps"
```

## Security & Privacy

- ✅ Sensitive config (`wrangler.toml`) is in `.gitignore` and never committed
- ✅ Database credentials stored only in Cloudflare (not in git)
- ✅ CORS restricted to `kavyakiran.life` domain
- ✅ HTTPS enforced for both frontend and backend
- ✅ RSVP data encrypted in transit

See [SECURITY.md](./SECURITY.md) for more details.

## Configuration

### Frontend
Edit `index.html` to update:
- Wedding date and time
- RSVP form destination
- Event details
- Travel information
- Gallery images

### Backend
Edit `worker/rsvp-worker.js` to update:
- Allowed origin (CORS)
- Database binding
- Validation rules

Edit `worker/wrangler.toml` (local only) to update:
- Cloudflare Account ID
- Worker route
- Environment variables

## Troubleshooting

**Website not loading?**
- Check GitHub Pages is enabled in repo settings
- Verify DNS CNAME record is set: `nslookup kavyakiran.life`
- Check repo is public

**RSVP form not working?**
- Verify worker is deployed: `wrangler deploy`
- Check browser console for errors
- Test worker endpoint: `curl https://wedding-rsvp.kavyakiran.life/rsvps`

**Database errors?**
- Verify database exists: `wrangler d1 list`
- Check schema initialized: `wrangler d1 execute wedding-rsvps --command "SELECT * FROM rsvps"`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more troubleshooting steps.

## Updates & Maintenance

### Update Frontend
```bash
git add index.html css/ js/
git commit -m "Update website"
git push
# Auto-deploys to GitHub Pages
```

### Update Backend
```bash
git add worker/rsvp-worker.js
git commit -m "Update worker logic"
git push
cd worker && wrangler deploy
```

### Update Database Schema
```bash
# Create migration file
wrangler d1 execute wedding-rsvps --file migrations/001_add_column.sql
```

## Contact

- **Website**: [kavyakiran.life](https://kavyakiran.life)
- **Event Date**: February 6, 2026

## License

Private - Wedding use only. Unauthorized reproduction prohibited.

---

**Made with ❤️ for Kavya & Kiran**
