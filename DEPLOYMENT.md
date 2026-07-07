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

---

# Chrome Extension: Publishing a New Version

The Chrome extension is a separate build from the web app. Its source lives in
`extension/` and is built into `dist-extension/`, then zipped for upload.

## 1. Bump the version

The Chrome Web Store rejects an upload whose version already exists, so you
**must** increment the version before every upload. Update it in **both** files:

- `extension/manifest.json` → `"version"`
- `package.json` → `"version"` (drives the zip filename)

Use semantic versioning, e.g. `1.0.0` → `1.0.1`.

## 2. Build and package

```bash
npm run package:extension
```

This runs `build:extension` (rebuilds `dist-extension/` from the current
`extension/` source) and zips it to `flowmodoro-extension-v<version>.zip` in the
repo root.

> ⚠️ **Always rebuild before packaging.** If you edit source files (icons,
> code) but skip the rebuild, the zip will contain a stale build. This is exactly
> how v1.0.0 shipped with the old "F" icon instead of the play button — the
> package predated the icon update.

## 3. Verify the package before uploading

Confirm the zip contains what you expect (example: the toolbar icon):

```bash
# Version inside the zipped manifest
unzip -p flowmodoro-extension-v1.0.1.zip manifest.json | grep '"version"'

# Icon in the zip matches the source icon
unzip -p flowmodoro-extension-v1.0.1.zip icons/icon-128.png | md5sum
md5sum extension/icons/icon-128.png   # the two md5s must match
```

## 4. Upload to the Chrome Web Store

The upload is **manual** (no free-tier API upload):

1. Open the [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   and sign in with the account that owns the item.
2. Click **Flowmodoro** in the items list.
3. **Package** tab (left sidebar) → **Upload new package** (top-right).
4. Select `flowmodoro-extension-v<version>.zip` — upload the **`.zip` itself**,
   not an unzipped folder. The store reads the version from the manifest inside.
5. Review the listing — previously-entered store listing / privacy fields carry
   over from the last version; fill in anything newly required.
6. Click **Submit for review**.

## 5. After submission

- Review typically takes hours to a few days; you get an email on approval.
- Once live, installed copies auto-update within a few hours.
- **To see the update immediately on your own machine:** `chrome://extensions`
  → enable Developer mode → **Update**, or remove and re-add the extension. This
  clears the cached toolbar icon.

## Troubleshooting

**Store still shows the old icon / old behavior after "updating"?**

- You likely uploaded a stale build. Re-run step 2 (rebuild) and verify with
  step 3 before uploading again.

**"Version already exists" on upload?**

- You didn't bump the version, or you selected an old zip. Redo step 1.
