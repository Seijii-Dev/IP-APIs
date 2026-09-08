# IP Tracker API

Self-hosted IP geolocation API deployed on Vercel.

## Endpoints

### GET /api/ip/:ip
Get geolocation for single IP

### GET /api/ip?ip=8.8.8.8
Query parameter alternative

### GET /api/ip/me
Get geolocation of request source IP

### POST /api/batch
Batch lookup (max 50 IPs)
Body: { "ips": ["8.8.8.8", "1.1.1.1"] }

### GET /api/health
Service health check

## Deployment

```bash
npm install
npm run build
vercel --prod