# Soil Test Tool

This tool allows home builders to swiftly determine if they can use soil on their land for a concrete lite material based home. Allowing them to source material onsite and minimize long wait time, heavy duty transportation, procurement and logistics of sourcing material.

## Features

- **Address-based Soil Analysis**: Enter any US address to get detailed soil data
- **Comprehensive Soil Data**:
  - Organic matter percentage
  - Sand, silt, and clay composition ratios
  - Particle size distribution by depth (up to 150cm)
  - Drainage characteristics
- **Suitability Assessment**: Get recommendations on whether the soil is suitable for earth-based building materials
- **Real-time Data**: Fetches data from USDA-NRCS Soil Survey and UC Davis SoilWeb

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Data Sources**:
  - USDA-NRCS Soil Data Access API
  - UC Davis SoilWeb API
  - OpenStreetMap Nominatim (Geocoding)
- **Deployment**: GitHub Actions → GitHub Pages

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Deployment

The app is automatically deployed via GitHub Actions when changes are pushed to the main branch or the feature branch. The workflow:

1. Builds the Next.js application
2. Exports static files
3. Deploys to GitHub Pages

## Data Sources

- **USDA-NRCS Soil Data Access**: Provides detailed SSURGO soil survey data
- **UC Davis SoilWeb**: User-friendly interface to soil survey data
- **OpenStreetMap Nominatim**: Free geocoding service to convert addresses to coordinates

## Usage

1. Enter your property address in the search box
2. Click "Analyze Soil"
3. View detailed soil composition and suitability assessment
4. Consult with a qualified engineer before making construction decisions

## License

See LICENSE file for details.

## Disclaimer

This tool provides general information based on USDA soil survey data. Always consult with qualified professionals (soil engineers, architects, builders) before making construction decisions.
