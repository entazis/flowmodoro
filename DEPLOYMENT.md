# Deployment Guide

This guide explains how to properly set the `VITE_BASE_PATH` environment variable when deploying the Flowmodoro app.

## Important: Environment Variables in Vite

⚠️ **Critical**: Vite environment variables are **embedded at build time**, not runtime. The `.env` file must be present during the build process, not when serving the static files.

## Deployment Options

### Option 1: Set Environment Variable During Build (Recommended)

Set the environment variable when running the build command:

```bash
# For root path deployment
VITE_BASE_PATH=/ npm run build

# For subdirectory deployment
VITE_BASE_PATH=/timer npm run build

# For nested subdirectory
VITE_BASE_PATH=/apps/timer npm run build
```

### Option 2: Use Environment-Specific Files

We've created environment-specific files that you can use:

```bash
# Use production config
npm run build:production

# Use staging config
npm run build:staging

# Build for root path
npm run build:root
```

### Option 3: CI/CD Pipeline

In your CI/CD pipeline, set the environment variable before building:

```yaml
# GitHub Actions example
- name: Build
  run: npm run build
  env:
    VITE_BASE_PATH: /timer

# Docker example
ENV VITE_BASE_PATH=/timer
RUN npm run build
```

### Option 4: Server-Side Environment

On your server, create the appropriate `.env` file before building:

```bash
# On the server
echo "VITE_BASE_PATH=/timer" > .env
npm install
npm run build

# Then serve the dist/ folder
```

## File Structure After Build

After running `npm run build`, serve the contents of the `dist/` folder:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

## Web Server Configuration

### Apache (.htaccess)

```apache
RewriteEngine On
RewriteRule ^timer/(.*)$ /timer/index.html [QSA,L]
```

### Nginx

```nginx
location /timer {
    try_files $uri $uri/ /timer/index.html;
}
```

### Static Hosting Services

- **Netlify**: Set `VITE_BASE_PATH` in build environment variables
- **Vercel**: Set `VITE_BASE_PATH` in project settings
- **GitHub Pages**: Use `VITE_BASE_PATH=/repository-name` if deploying to user/repository-name

## Verification

After deployment, check that:

1. The app loads at your expected URL (e.g., `yoursite.com/timer`)
2. Navigation works correctly
3. Assets load from the correct paths

## Troubleshooting

**Assets not loading?**

- Verify `VITE_BASE_PATH` was set during build
- Check browser developer tools for 404 errors

**Routing issues?**

- Ensure your web server is configured for SPA routing
- Check that both Vite `base` and React Router `basename` use the same path
