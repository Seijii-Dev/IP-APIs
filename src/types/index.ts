export interface GeoLocation {
  ip: string
  type: 'IPv4' | 'IPv6'
  continent?: string
  country: string
  countryCode: string
  region?: string
  city?: string
  latitude: number | null
  longitude: number | null
  postal?: string
  timezone?: string
  asn?: string
  isp?: string
  org?: string
  confidence: number
  source: string
  timestamp: string
}

export interface BatchResponse {
  results: GeoLocation[]
  failed: string[]
  total: number
  success: number
}

export interface CacheEntry {
  data: GeoLocation
  expiry: number
}