// Soil data fetching from SoilWeb API and NRCS Soil Data Access

export interface SoilData {
  location: {
    lat: number;
    lon: number;
    address: string;
  };
  soilProperties: {
    organicMatter?: number;
    sand?: number;
    silt?: number;
    clay?: number;
    drainage?: string;
    particleSizeByDepth?: Array<{
      depth: string;
      sand: number;
      silt: number;
      clay: number;
    }>;
  };
  mukey?: string;
  mapUnitName?: string;
  error?: string;
}

interface SoilWebResponse {
  mukey?: string;
  muname?: string;
  mukind?: string;
  muacres?: number;
  mapunits?: Array<{
    mukey: string;
    muname: string;
    mukind: string;
  }>;
}

export async function fetchSoilData(lat: number, lon: number, address: string): Promise<SoilData> {
  try {
    // Try SoilWeb API first
    const soilWebUrl = `https://casoilresource.lawr.ucdavis.edu/soil_web/reflector_api/soils.php?what=mapunit&lon=${lon}&lat=${lat}`;

    console.log('Fetching soil data from:', soilWebUrl);
    const response = await fetch(soilWebUrl);

    console.log('SoilWeb response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`SoilWeb API request failed: ${response.status} ${response.statusText}`);
    }

    const data: SoilWebResponse = await response.json();
    console.log('SoilWeb response data:', data);

    // If we got a mukey, fetch detailed soil properties
    if (data.mukey || (data.mapunits && data.mapunits.length > 0)) {
      const mukey = data.mukey || data.mapunits![0].mukey;
      const muname = data.muname || data.mapunits![0].muname;

      // Fetch detailed component data from NRCS SDA
      const soilProperties = await fetchDetailedSoilProperties(mukey);

      return {
        location: { lat, lon, address },
        mukey,
        mapUnitName: muname,
        soilProperties
      };
    }

    // No data found
    return {
      location: { lat, lon, address },
      soilProperties: {},
      error: 'No soil data available for this location'
    };
  } catch (error) {
    console.error('Soil data fetch error:', error);

    // Provide more helpful error message
    let errorMessage = 'Failed to fetch soil data';
    if (error instanceof Error) {
      errorMessage = error.message;

      // Check for common errors
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to soil data service. This may be due to browser security restrictions. Try accessing the deployed site instead of localhost.';
      }
    }

    return {
      location: { lat, lon, address },
      soilProperties: {},
      error: errorMessage
    };
  }
}

async function fetchDetailedSoilProperties(mukey: string) {
  try {
    // Query NRCS Soil Data Access for component data
    const query = `
      SELECT
        c.cokey,
        c.comppct_r,
        c.compname,
        c.taxorder,
        c.drainagecl,
        ch.hzdept_r,
        ch.hzdepb_r,
        ch.sandtotal_r,
        ch.silttotal_r,
        ch.claytotal_r,
        ch.om_r
      FROM component c
      LEFT JOIN chorizon ch ON c.cokey = ch.cokey
      WHERE c.mukey = '${mukey}'
      ORDER BY c.comppct_r DESC, ch.hzdept_r ASC
    `;

    console.log('Querying NRCS SDA for mukey:', mukey);
    const response = await fetch('https://SDMDataAccess.sc.egov.usda.gov/Tabular/post.rest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        format: 'json'
      })
    });

    console.log('NRCS SDA response status:', response.status);

    if (!response.ok) {
      throw new Error(`NRCS SDA query failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('NRCS SDA response:', result);

    if (result.Table && result.Table.length > 0) {
      const data = result.Table;

      // Calculate average values and organize by depth
      const particleSizeByDepth: Array<{
        depth: string;
        sand: number;
        silt: number;
        clay: number;
      }> = [];

      let totalSand = 0, totalSilt = 0, totalClay = 0, totalOM = 0;
      let count = 0;

      data.forEach((row: any) => {
        const [cokey, comppct, compname, taxorder, drainage, hzdept, hzdepb, sand, silt, clay, om] = row;

        if (sand !== null && silt !== null && clay !== null) {
          totalSand += sand;
          totalSilt += silt;
          totalClay += clay;
          count++;

          if (hzdept !== null && hzdepb !== null && hzdepb <= 150) {
            particleSizeByDepth.push({
              depth: `${hzdept}-${hzdepb} cm`,
              sand,
              silt,
              clay
            });
          }
        }

        if (om !== null) {
          totalOM += om;
        }
      });

      return {
        organicMatter: count > 0 ? totalOM / count : undefined,
        sand: count > 0 ? totalSand / count : undefined,
        silt: count > 0 ? totalSilt / count : undefined,
        clay: count > 0 ? totalClay / count : undefined,
        drainage: data[0][4] || undefined,
        particleSizeByDepth: particleSizeByDepth.length > 0 ? particleSizeByDepth : undefined
      };
    }

    return {};
  } catch (error) {
    console.error('Detailed soil properties fetch error:', error);
    return {};
  }
}
