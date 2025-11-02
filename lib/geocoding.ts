// Geocoding service to convert address to lat/lon
// Using Nominatim (OpenStreetMap) - free and no API key required

export interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    // Add US bias for better results
    const searchParams = new URLSearchParams({
      format: 'json',
      q: address,
      limit: '1',
      countrycodes: 'us',
      addressdetails: '1'
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${searchParams.toString()}`
      // Note: Don't set custom headers like User-Agent - browsers block this
    );

    if (!response.ok) {
      console.error('Geocoding response not OK:', response.status, response.statusText);
      throw new Error(`Geocoding failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Geocoding response:', data);

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
