# Deployment Guide

## Deploying to generationalhouse.com/soil-test

This application is configured to deploy to a subdirectory of generationalhouse.com.

### Current Configuration

The app is configured with:
- Base path: `/soil-test`
- Asset prefix: `/soil-test/`
- Output: Static export

### GitHub Pages Deployment (Current)

The GitHub Actions workflow deploys to GitHub Pages automatically on push to:
- `main` branch
- `claude/build-deploy-github-actions-011CUhB5KX77yFNcdKNLV52G` branch

#### Enable GitHub Pages

1. Go to repository Settings → Pages
2. Under "Build and deployment", select:
   - Source: GitHub Actions
3. The workflow will automatically deploy on the next push

The site will be available at: `https://<username>.github.io/<repo-name>/`

### Custom Domain Deployment (generationalhouse.com)

To deploy to https://generationalhouse.com/soil-test:

#### Option 1: Subdirectory on Existing Server

If generationalhouse.com is hosted on your own server:

1. Build the static site locally or via CI:
   ```bash
   npm run build
   ```

2. Copy the `out/` directory contents to your server:
   ```bash
   scp -r out/* user@generationalhouse.com:/var/www/generationalhouse.com/soil-test/
   ```

3. Configure your web server (nginx example):
   ```nginx
   location /soil-test {
       alias /var/www/generationalhouse.com/soil-test;
       try_files $uri $uri/ /soil-test/index.html;
   }
   ```

#### Option 2: GitHub Pages with Custom Domain

1. Add a CNAME file to the `public/` directory:
   ```
   echo "generationalhouse.com" > public/CNAME
   ```

2. Configure DNS:
   - Add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add CNAME record: `<username>.github.io`

3. In GitHub repository settings, set custom domain to `generationalhouse.com`

#### Option 3: FTP/SFTP Deployment

Modify the GitHub Actions workflow to use FTP deployment:

```yaml
- name: Deploy to FTP
  uses: SamKirkland/FTP-Deploy-Action@4.3.0
  with:
    server: ${{ secrets.FTP_SERVER }}
    username: ${{ secrets.FTP_USERNAME }}
    password: ${{ secrets.FTP_PASSWORD }}
    local-dir: ./out/
    server-dir: /public_html/soil-test/
```

### Environment Variables

If you need environment variables for production:

1. Create `.env.production`:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   ```

2. Add secrets to GitHub Actions (Settings → Secrets and variables → Actions)

### Verifying Deployment

After deployment, test the application:

1. Visit https://generationalhouse.com/soil-test
2. Enter a test address (e.g., "1600 Pennsylvania Avenue NW, Washington, DC")
3. Verify soil data loads correctly
4. Check browser console for any errors

### Troubleshooting

**404 errors on page refresh:**
- Ensure server is configured to redirect to index.html
- Check base path configuration matches deployment path

**Assets not loading:**
- Verify asset prefix in next.config.js
- Check that files are deployed to correct directory

**API CORS errors:**
- SoilWeb API may block requests from certain domains
- Consider adding a serverless proxy function if needed

### Notes

- The app uses client-side API calls to external services (NRCS, SoilWeb, Nominatim)
- No server-side code is required
- All data fetching happens in the browser
- CORS may be an issue with some APIs - if so, we'll need to add a proxy
