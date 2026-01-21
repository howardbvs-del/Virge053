
export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface TacticalZone {
  id: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  type: 'RED' | 'GREEN';
  label: string;
}

export type DeviceType = 'GUARDIAN' | 'UNKNOWN' | 'SUSPECT' | 'POI_POLICE' | 'POI_FOOD' | 'POI_LEISURE' | 'POI_SPORTS' | 'POI_SALON' | 'POI_MALL' | 'POI_ACCIDENT' | 'POI_ROAD_CLOSED' | 'POI_SALE' | 'POI_EVENT' | 'POI_HOTEL';

export interface NearbyDevice {
  id: string;
  type: DeviceType;
  signalStrength: number;
  distance: number;
  label: string;
  lat?: number;
  lng?: number;
}

export enum AppStatus {
  UNREGISTERED = 'UNREGISTERED',
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  SOS_PENDING = 'SOS_PENDING',
  SOS_ACTIVE = 'SOS_ACTIVE',
  DEBRIEFING = 'DEBRIEFING',
  MARKETPLACE = 'MARKETPLACE',
  SECURED = 'SECURED'
}

export interface RegistrationData {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  isRicaVerified: boolean;
}

export interface IntelligenceReport {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
  summary: string;
  cityName?: string;
  nearbySafetyPoints?: string[];
  tacticalZones?: TacticalZone[];
  nearbyPois?: NearbyDevice[];
}
