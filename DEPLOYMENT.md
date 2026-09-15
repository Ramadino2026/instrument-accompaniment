# 🚀 Deployment Guide

Complete guide to deploy the Instrument Accompaniment Generator to production.

## Table of Contents
1. [Local Development](#local-development)
2. [GitHub Pages](#github-pages)
3. [Netlify](#netlify)
4. [Vercel](#vercel)
5. [Traditional Server](#traditional-server)
6. [Docker](#docker)
7. [Security Checklist](#security-checklist)

---

## Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Ramadino2026/instrument-accompaniment.git
cd instrument-accompaniment

# Start server (Python 3)
python3 server.py

# Or use Node.js
npx http-server

# Open browser
open http://localhost:8000
```

### Development with Hot Reload
```bash
# Install live-server globally
npm install -g live-server

# Run with auto-reload
live-server
```

---

## GitHub Pages

### Setup (Free Hosting)

1. **Ensure repository is public**
   ```bash
   git config --global user.email "your-email@example.com"
   git config --global user.name "Your Name"
   ```

2. **Push to GitHub**
   ```bash
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to Settings > Pages
   - Source: main branch / root folder
   - Save

4. **Access your site**
   ```
   https://Ramadino2026.github.io/instrument-accompaniment
   ```

### Custom Domain (Optional)
1. Add CNAME file to repo root:
   ```
   yourdomain.com
   ```
2. Configure DNS records at your domain provider
3. Enable HTTPS enforcement in GitHub Pages settings

---

## Netlify (Recommended)

### Automatic Deployment from GitHub

1. **Connect Repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Select GitHub repository
   - Authorize Netlify

2. **Configure Build**
   - Build command: (leave empty)
   - Publish directory: . (root)
   - Click Deploy

3. **Your site is live!**
   ```
   https://your-site-name.netlify.app
   ```

### Custom Domain
- Domain settings > Add custom domain
- Update DNS at domain provider
- Enable automatic HTTPS

### Environment Variables
- Site settings > Build & deploy > Environment
- Add any API keys needed for production

### Netlify Functions (For Backend)
Create `netlify/functions/generate-accompaniment.js`:
```javascript
exports.handler = async (event) => {
    // Your accompaniment generation logic
    return {
        statusCode: 200,
        body: JSON.stringify({ /* result */ })
    };
};
```

---

## Vercel

### Setup

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts**
   - Select project name
   - Link to GitHub (optional)
   - Deploy settings should auto-detect

### Automatic Deployments
- Enable GitHub integration in Vercel dashboard
- Every push to main branch auto-deploys

### Production URL
```
https://your-project-name.vercel.app
```

---

## Traditional Server

### AWS EC2

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install dependencies
sudo apt update
sudo apt install python3 python3-pip
sudo apt install nodejs npm

# Clone repository
git clone https://github.com/Ramadino2026/instrument-accompaniment.git
cd instrument-accompaniment

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.py --name "accompaniment"
pm2 startup
pm2 save

# Setup Nginx as reverse proxy
sudo apt install nginx
```

### Nginx Configuration
Create `/etc/nginx/sites-available/accompaniment`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable HTTPS with Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### DigitalOcean App Platform

1. Go to digitalocean.com
2. Create new App
3. Connect GitHub repository
4. Configure:
   - HTTP port: 8000
   - Build command: (none)
   - Run command: `python3 server.py`
5. Deploy

---

## Docker

### Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY . .

EXPOSE 8000

CMD ["python3", "server.py"]
```

### Build & Run Locally
```bash
# Build image
docker build -t accompaniment .

# Run container
docker run -p 8000:8000 accompaniment

# Push to Docker Hub
docker tag accompaniment your-username/accompaniment
docker push your-username/accompaniment
```

### Docker Compose
```yaml
version: '3'
services:
  accompaniment:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
```

```bash
docker-compose up
```

---

## Performance Optimization

### 1. Enable Caching
Add to `server.py`:
```python
self.send_header('Cache-Control', 'public, max-age=3600')
```

### 2. Enable GZIP Compression
Nginx:
```nginx
gzip on;
gzip_types text/plain text/css application/javascript;
```

### 3. Minify Assets
```bash
# Install minifiers
npm install -g minify

# Minify CSS
minify styles.css > styles.min.css

# Minify JS
minify app.js > app.min.js
```

Update `index.html`:
```html
<link rel="stylesheet" href="styles.min.css">
<script src="app.min.js"></script>
```

### 4. CDN Integration
Use Cloudflare or similar:
- Free SSL/TLS
- Global CDN
- DDoS protection
- Caching

---

## Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Set security headers:
  ```
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  ```
- [ ] Set CORS headers appropriately
- [ ] Disable directory listing
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting for APIs
- [ ] Enable HSTS (HTTP Strict Transport Security)
- [ ] Regular backups

### Nginx Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(self), camera=()" always;
```

---

## Environment Variables

### Development
```
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Production
```
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
API_URL=https://yourdomain.com/api
CORS_ORIGIN=https://yourdomain.com
```

---

## Monitoring & Logging

### Application Logs
```bash
# With PM2
pm2 logs accompaniment

# With Docker
docker logs container-id -f
```

### Uptime Monitoring
- UptimeRobot (free)
- Pingdom
- Freshping

### Error Tracking
- Sentry (free tier available)
- Rollbar
- Honeybadger

---

## Database Setup (For Future Versions)

### PostgreSQL
```bash
# Install
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb accompaniment

# Connect
psql -U postgres -d accompaniment
```

### MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongo mongo

# Connect
mongodb://localhost:27017/accompaniment
```

---

## CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Scaling Considerations

### Load Balancing
- Nginx load balancer
- AWS ELB/ALB
- Round-robin DNS

### Caching Strategy
- Redis for session management
- CloudFlare for static assets
- Browser caching for CSS/JS

### Database Optimization
- Connection pooling
- Query indexing
- Read replicas

---

## Rollback Procedure

### GitHub Pages
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

### Netlify
- Dashboard > Deploys
- Click previous deploy
- Click "Restore"

### Vercel
- Vercel Dashboard
- Select deployment
- Click "Promote to Production"

---

## Troubleshooting Deployment

### 404 Errors
- Ensure `index.html` is at root
- Check build settings
- Verify file paths are relative

### CORS Errors
- Check server CORS headers
- Update allowed origins
- Test with curl:
  ```bash
  curl -H "Origin: http://localhost:8000" \
       -H "Access-Control-Request-Method: GET" \
       https://yourdomain.com
  ```

### Microphone Not Working
- Ensure HTTPS in production
- Check browser permissions
- Verify getUserMedia is allowed

### Slow Performance
- Enable compression
- Check CDN configuration
- Optimize assets
- Monitor server resources

---

## Support & Resources

- 📖 [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- 🐳 [Docker Documentation](https://docs.docker.com/)
- 🚀 [Netlify Docs](https://docs.netlify.com/)
- ⚡ [Vercel Docs](https://vercel.com/docs)
- 🔐 [OWASP Security](https://owasp.org/)

---

**Ready to go live? Choose your platform and deploy! 🚀**