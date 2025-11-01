'use client';

import { useState } from 'react';
import { geocodeAddress } from '@/lib/geocoding';
import { fetchSoilData, SoilData } from '@/lib/soilData';
import styles from './page.module.css';

export default function Home() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSoilData(null);

    try {
      // Step 1: Geocode the address
      const geoResult = await geocodeAddress(address);

      if (!geoResult) {
        setError('Address not found. Please try a different address.');
        setLoading(false);
        return;
      }

      // Step 2: Fetch soil data
      const data = await fetchSoilData(geoResult.lat, geoResult.lon, geoResult.display_name);

      if (data.error) {
        setError(data.error);
      }

      setSoilData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Soil Test Tool</h1>
          <p className={styles.subtitle}>
            Determine if soil on your land is suitable for concrete lite material based homes
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your property address..."
              className={styles.input}
              required
            />
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'Analyzing...' : 'Analyze Soil'}
            </button>
          </div>
        </form>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {soilData && !soilData.error && (
          <div className={styles.results}>
            <h2>Soil Analysis Results</h2>

            <div className={styles.resultCard}>
              <h3>Location</h3>
              <p>{soilData.location.address}</p>
              <p className={styles.coordinates}>
                Lat: {soilData.location.lat.toFixed(6)}, Lon: {soilData.location.lon.toFixed(6)}
              </p>
            </div>

            {soilData.mapUnitName && (
              <div className={styles.resultCard}>
                <h3>Soil Map Unit</h3>
                <p>{soilData.mapUnitName}</p>
                {soilData.mukey && <p className={styles.mukey}>Map Unit Key: {soilData.mukey}</p>}
              </div>
            )}

            <div className={styles.resultCard}>
              <h3>Soil Composition</h3>
              <div className={styles.composition}>
                {soilData.soilProperties.sand !== undefined && (
                  <div className={styles.property}>
                    <span className={styles.label}>Sand:</span>
                    <span className={styles.value}>{soilData.soilProperties.sand.toFixed(1)}%</span>
                  </div>
                )}
                {soilData.soilProperties.silt !== undefined && (
                  <div className={styles.property}>
                    <span className={styles.label}>Silt:</span>
                    <span className={styles.value}>{soilData.soilProperties.silt.toFixed(1)}%</span>
                  </div>
                )}
                {soilData.soilProperties.clay !== undefined && (
                  <div className={styles.property}>
                    <span className={styles.label}>Clay:</span>
                    <span className={styles.value}>{soilData.soilProperties.clay.toFixed(1)}%</span>
                  </div>
                )}
                {soilData.soilProperties.organicMatter !== undefined && (
                  <div className={styles.property}>
                    <span className={styles.label}>Organic Matter:</span>
                    <span className={styles.value}>{soilData.soilProperties.organicMatter.toFixed(2)}%</span>
                  </div>
                )}
              </div>
            </div>

            {soilData.soilProperties.drainage && (
              <div className={styles.resultCard}>
                <h3>Drainage</h3>
                <p>{soilData.soilProperties.drainage}</p>
              </div>
            )}

            {soilData.soilProperties.particleSizeByDepth && soilData.soilProperties.particleSizeByDepth.length > 0 && (
              <div className={styles.resultCard}>
                <h3>Particle Size by Depth (up to 150cm)</h3>
                <div className={styles.depthData}>
                  {soilData.soilProperties.particleSizeByDepth.map((layer, index) => (
                    <div key={index} className={styles.depthLayer}>
                      <strong>{layer.depth}</strong>
                      <div className={styles.depthValues}>
                        <span>Sand: {layer.sand.toFixed(1)}%</span>
                        <span>Silt: {layer.silt.toFixed(1)}%</span>
                        <span>Clay: {layer.clay.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.interpretation}>
              <h3>Suitability Assessment</h3>
              <p>
                {getSuitabilityText(soilData)}
              </p>
            </div>
          </div>
        )}

        <footer className={styles.footer}>
          <p>
            Data sourced from USDA-NRCS Soil Survey and UC Davis SoilWeb
          </p>
          <p>
            <a href="https://generationalhouse.com" target="_blank" rel="noopener noreferrer">
              Generational House
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

function getSuitabilityText(soilData: SoilData): string {
  const { clay, sand, drainage } = soilData.soilProperties;

  if (clay === undefined || sand === undefined) {
    return 'Unable to determine suitability due to insufficient data.';
  }

  // Basic assessment for concrete lite materials (compressed earth blocks, rammed earth, etc.)
  let suitability = [];

  // Clay content assessment
  if (clay >= 10 && clay <= 30) {
    suitability.push('Clay content is within ideal range (10-30%) for soil-based building materials.');
  } else if (clay < 10) {
    suitability.push('Clay content may be too low - consider adding clay or using stabilizers.');
  } else {
    suitability.push('Clay content is high - may require additional sand or stabilizers to prevent cracking.');
  }

  // Sand content assessment
  if (sand >= 50 && sand <= 75) {
    suitability.push('Sand content is suitable for structural stability.');
  }

  // Drainage assessment
  if (drainage && (drainage.toLowerCase().includes('well') || drainage.toLowerCase().includes('good'))) {
    suitability.push('Good drainage characteristics are beneficial for construction.');
  } else if (drainage && drainage.toLowerCase().includes('poor')) {
    suitability.push('Poor drainage may require site preparation and foundation work.');
  }

  if (suitability.length === 0) {
    return 'Consult with a soil engineer for detailed analysis before proceeding with construction.';
  }

  return suitability.join(' ') + ' Always consult with a qualified engineer before making construction decisions.';
}
