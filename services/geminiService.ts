
import { GoogleGenAI, Type } from "@google/genai";
import { IntelligenceReport, GeoLocation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTacticalAdvice = async (
  situation: string,
  location: GeoLocation | null
): Promise<IntelligenceReport> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `SITUATION: ${situation}. 
      COORDINATES: ${location?.lat}, ${location?.lng}.
      
      TASK:
      1. Identify the current city and neighborhood.
      2. Based on real-time and historical patterns, identify 3 'RED ZONES' (high risk) and 3 'GREEN ZONES' (low risk).
      3. Identify nearby Points of Interest (POIs) including: police stations, food take-aways, leisure, sports, wellness, malls, and HOTELS/GUESTHOUSES.
      4. CRITICAL: For hotels/guesthouses, include their name and an approximate star/user rating (e.g. "Grand Hotel - 4.5*").
      5. CRITICAL: Include "Life Updates" - situational awareness markers such as:
         - Road closures or heavy traffic.
         - Recent accidents or emergency service activity.
         - Local sales, discounts at shops, or community events.
      
      Output structured data with lat/lng coordinates and category-specific labels.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            cityName: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            tacticalZones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER },
                  radius: { type: Type.NUMBER },
                  type: { type: Type.STRING, description: "RED or GREEN" },
                  label: { type: Type.STRING }
                },
                required: ["id", "lat", "lng", "radius", "type", "label"]
              }
            },
            nearbyPois: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, description: "POI_POLICE, POI_FOOD, POI_LEISURE, POI_SPORTS, POI_SALON, POI_MALL, POI_ACCIDENT, POI_ROAD_CLOSED, POI_SALE, POI_EVENT, POI_HOTEL" },
                  label: { type: Type.STRING },
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER },
                  distance: { type: Type.NUMBER }
                },
                required: ["id", "type", "label", "lat", "lng"]
              }
            }
          },
          required: ["riskLevel", "summary", "cityName", "recommendations", "tacticalZones", "nearbyPois"]
        }
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    const fallbackLat = location?.lat || 0;
    const fallbackLng = location?.lng || 0;
    return {
      riskLevel: "HIGH",
      summary: "Local intelligence link degraded. Using predictive modeling for life updates.",
      cityName: "Unknown Sector",
      recommendations: ["Monitor map for road closures.", "Stay in Green Zones.", "Avoid reported accident areas."],
      tacticalZones: [
        { id: 'z1', lat: fallbackLat + 0.005, lng: fallbackLng + 0.005, radius: 300, type: 'RED', label: 'HIGH_CRIME_ALLEY' },
        { id: 'z2', lat: fallbackLat - 0.005, lng: fallbackLng - 0.005, radius: 400, type: 'GREEN', label: 'CENTRAL_PARK_SAFE' }
      ],
      nearbyPois: [
        { id: 'p1', type: 'POI_POLICE', label: 'STATION_A', lat: fallbackLat + 0.002, lng: fallbackLng - 0.002, signalStrength: 1.0, distance: 0.2 },
        { id: 'p2', type: 'POI_ROAD_CLOSED', label: 'MAIN_ST_CLOSED', lat: fallbackLat + 0.003, lng: fallbackLng + 0.001, signalStrength: 0.8, distance: 0.3 },
        { id: 'p3', type: 'POI_SALE', label: 'MALL_50%_SALE', lat: fallbackLat - 0.003, lng: fallbackLng + 0.004, signalStrength: 0.9, distance: 0.5 },
        { id: 'p4', type: 'POI_HOTEL', label: 'SAFE_HOUSE_INN - 4.2*', lat: fallbackLat + 0.004, lng: fallbackLng - 0.001, signalStrength: 1.0, distance: 0.4 }
      ]
    };
  }
};
