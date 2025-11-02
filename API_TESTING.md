# API Testing & Debugging Guide

## Understanding the "Failed to Fetch" Error

The "Failed to fetch" error when testing locally is caused by **CORS (Cross-Origin Resource Sharing)** restrictions:

- **Nominatim API** (OpenStreetMap): May block localhost requests
- **SoilWeb API** (UC Davis): May have CORS restrictions
- **NRCS Soil Data Access**: May block cross-origin requests

### Why It Works on Deployed Site But Not Localhost

When deployed to GitHub Pages (https://tothemarsbaby.github.io/soil_test/), the APIs often allow requests from HTTPS domains but block localhost.

## Testing Steps

### Step 1: Check Browser Console

1. Open the app in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try entering an address
5. Look for error messages with details

You should see console logs like:
```
Fetching soil data from: https://casoilresource.lawr...
Geocoding response: [...]
SoilWeb response status: 200 OK
```

### Step 2: Test on Deployed Site

Instead of testing on localhost, test on the actual deployed site:

**https://tothemarsbaby.github.io/soil_test/**

This often works because:
- HTTPS domain (not localhost)
- Public URL (APIs may whitelist GitHub Pages)
- Browser security is less strict for HTTPS

### Step 3: Test Individual APIs

You can test if the APIs are working by opening these URLs directly in your browser:

#### Geocoding Test:
```
https://nominatim.openstreetmap.org/search?format=json&q=1600+Pennsylvania+Avenue+NW,+Washington,+DC&limit=1&countrycodes=us
```

Should return JSON with location data.

#### SoilWeb Test (after getting coordinates):
```
https://casoilresource.lawr.ucdavis.edu/soil_web/reflector_api/soils.php?what=mapunit&lon=-77.036&lat=38.897
```

Should return JSON with soil map unit data.

## Solutions for Local Development

### Option 1: Use CORS Proxy (Development Only)

Add this at the top of your fetch calls during development:

```typescript
const CORS_PROXY = 'https://corsproxy.io/?';
const url = CORS_PROXY + encodeURIComponent(apiUrl);
```

**Note:** Only for development! Remove before deployment.

### Option 2: Browser Extensions

Install a CORS extension for your browser:
- Chrome: "CORS Unblock" extension
- Firefox: "CORS Everywhere" extension

**Warning:** Remember to disable after testing for security!

### Option 3: Test with Production Build on GitHub Pages

The simplest solution:
1. Push your code
2. Let GitHub Actions deploy
3. Test on https://tothemarsbaby.github.io/soil_test/

## Expected Behavior

### Working Correctly:

When you enter an address like "1600 Pennsylvania Avenue NW, Washington, DC", you should see:

1. Button text changes to "Analyzing..."
2. Console shows:
   ```
   Fetching soil data from: https://casoilresource...
   Geocoding response: [{lat: 38.897..., lon: -77.036...}]
   SoilWeb response status: 200 OK
   SoilWeb response data: {mukey: "...", muname: "..."}
   ```
3. Results appear showing:
   - Location details
   - Soil map unit name
   - Sand/Silt/Clay percentages
   - Organic matter
   - Drainage info
   - Suitability assessment

### Error States:

If you see:
- **"Failed to fetch"** → CORS issue, try deployed site
- **"Address not found"** → Try more specific address
- **"No soil data available"** → Location outside US or no SSURGO data
- **"Unable to connect to soil data service"** → API is down or blocking requests

## Sample Test Addresses

Try these addresses (they should have good soil data):

1. **Washington DC:**
   ```
   1600 Pennsylvania Avenue NW, Washington, DC
   ```

2. **Iowa (Agricultural area with detailed soil data):**
   ```
   Ames, Iowa
   ```

3. **California:**
   ```
   Sacramento, California
   ```

4. **Texas:**
   ```
   Austin, Texas
   ```

## Debugging Checklist

- [ ] Open browser console (F12)
- [ ] Try entering an address
- [ ] Check console for error messages
- [ ] Verify network tab shows API requests
- [ ] Try same address on deployed site
- [ ] Test API URLs directly in browser
- [ ] Check if browser extensions are blocking requests
- [ ] Try different browser (Chrome vs Firefox)

## When to Deploy vs Test Locally

**Test Locally When:**
- Making UI changes
- Debugging layout/styling
- Testing form validation
- Checking error message display

**Test on Deployed Site When:**
- Testing API integrations
- Verifying data fetching works
- Checking production build
- Testing with real users

## Next Steps

If APIs still don't work even on the deployed site, we may need to:

1. **Add a backend proxy**: Create serverless functions to proxy API requests
2. **Use alternative APIs**: Find APIs with better CORS support
3. **Cache data**: Pre-fetch common locations and cache results
4. **Add API keys**: Some APIs require registration for CORS whitelisting

Let me know what errors you see in the browser console and we can debug further!
