# Local Testing & Deployment Guide

## 🎯 Current Situation

Your app is deployed to **GitHub Pages**, NOT to generationalhouse.com (which is on Squarespace).

### GitHub Pages URL (where your app actually is):
**https://tothemarsbaby.github.io/soil_test/**

Try accessing this URL - you should see the working app there!

---

## 🧪 Testing Locally

You have TWO servers running right now:

### Option 1: Development Server (Live Reload)
```bash
# Already running on port 3000
# Access at: http://localhost:3000
```
This auto-reloads when you make code changes.

### Option 2: Production Build (What gets deployed)
```bash
# Already running on port 8080
# Access at: http://localhost:8080
```
This serves the exact files that would be deployed.

### To Test on Your Machine:

1. **Development mode:**
   ```bash
   npm run dev
   ```
   Then open http://localhost:3000 in your browser

2. **Production mode:**
   ```bash
   npm run build
   cd out
   python3 -m http.server 8080
   ```
   Then open http://localhost:8080 in your browser

---

## 🚀 Deployment Options for generationalhouse.com

Since generationalhouse.com is on **Squarespace**, you have these options:

### Option 1: Subdomain (Recommended)
Deploy to a subdomain like **soiltest.generationalhouse.com**

1. In your Squarespace settings, add a CNAME record:
   - **Host:** `soiltest`
   - **Points to:** `tothemarsbaby.github.io`

2. Update `public/CNAME` file in this repo:
   ```
   echo "soiltest.generationalhouse.com" > public/CNAME
   ```

3. Rebuild and deploy

### Option 2: Squarespace Code Injection (Limited)
Upload the files to Squarespace, but this is very limited and not recommended for React apps.

### Option 3: Separate Hosting
Keep using GitHub Pages and link to it from your main site:
- Main site: https://generationalhouse.com
- Soil test app: https://tothemarsbaby.github.io/soil_test/

Just add a button/link on your Squarespace site pointing to the GitHub Pages URL.

### Option 4: Move to Traditional Hosting
If you have access to a server or hosting service:
1. Copy contents of `out/` folder to your web server
2. Configure your domain to point to that server
3. Set up HTTPS

---

## 🔍 How to Debug

### 1. Check if HTML is loading:
```bash
curl https://tothemarsbaby.github.io/soil_test/ | head -20
```

### 2. Check browser console:
Open browser DevTools (F12) → Console tab
Look for errors loading CSS/JS files

### 3. Check network tab:
DevTools → Network tab
See which files are loading and which are 404

### 4. Verify CSS is loading:
Check if this URL works:
```
https://tothemarsbaby.github.io/soil_test/_next/static/css/68a22385c7f24f8d.css
```

---

## 📝 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server (with hot reload)
npm run dev
# Visit: http://localhost:3000

# Build for production
npm run build

# Test production build locally
cd out
python3 -m http.server 8080
# Visit: http://localhost:8080

# Or use npx serve
npx serve out -p 8080
```

---

## ✅ What Should Work Right Now

1. **GitHub Pages:** https://tothemarsbaby.github.io/soil_test/
2. **Local Dev:** http://localhost:3000 (if running `npm run dev`)
3. **Local Production:** http://localhost:8080 (if serving `out/` folder)

## ❌ What Won't Work

- http://www.generationalhouse.com/ - This is your Squarespace site, NOT connected to GitHub Pages

---

## 🎨 What You Should See

When the app loads correctly, you'll see:
- **Purple gradient background**
- **White "Soil Test Tool" title**
- **Input field** for address
- **Pink "Analyze Soil" button**
- **Footer** with attribution

If you see a blank page or Squarespace logo, you're at the wrong URL!
