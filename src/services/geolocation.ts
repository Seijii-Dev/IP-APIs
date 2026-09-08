import { isValidIP, normalizeIP, isPrivateIP } from './validators.js'
import { getCached, setCache } from './cache.js'
import type { GeoLocation } from '../types/index.js'

interface IPApiResponse {
  status: string
  message?: string
  continent?: string
  country?: string
  countryCode?: string
  regionName?: string
  city?: string
  zip?: string
  lat?: number
  lon?: number
  timezone?: string
  isp?: string
  org?: string
  as?: string
  query?: string
}

interface IPWhoIsResponse {
  success: boolean
  ip?: string
  type?: 'IPv4' | 'IPv6'
  continent?: string
  country?: string
  country_code?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  postal?: string
  timezone?: { id?: string }
  connection?: {
    asn?: string
    isp?: string
    org?: string
  }
}

export async function getGeolocation(ip: string): Promise<GeoLocation> {
  const normalized = normalizeIP(ip)
  
  if (!isValidIP(normalized)) {
    throw new Error('Invalid IP address format')
  }

  if (isPrivateIP(normalized)) {
    return {
      ip: normalized,
      type: normalized.includes(':') ? 'IPv6' : 'IPv4',
      country: 'Private',
      countryCode: 'PR',
      latitude: null,
      longitude: null,
      confidence: 100,
      source: 'local',
      timestamp: new Date().toISOString()
    }
  }

  const cached = getCached(normalized)
  if (cached) return cached

  const result = await fetchIPAPI(normalized)
  
  if (!result || !result.country) {
    const fallback = await fetchIPWhoIs(normalized)
    if (fallback) {
      const merged = result ? { ...fallback, ...result } : fallback
      setCache(normalized, merged)
      return merged
    }
    throw new Error('All geolocation sources failed')
  }

  setCache(normalized, result)
  return result
}

async function fetchIPAPI(ip: string): Promise<GeoLocation | null> {
  try {
    const url = `https://ip-api.com/json/${ip}?fields=status,message,continent,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    
    const res = await fetch(url, {
      headers: { 'User-Agent': 'IP-Tracker-API/1.0' },
      signal: controller.signal
    })
    
    clearTimeout(timeout)
    
    if (!res.ok) return null
    
    const data = await res.json() as IPApiResponse
    if (data.status !== 'success') return null

    return {
      ip: data.query || ip,
      type: ip.includes(':') ? 'IPv6' : 'IPv4',
      continent: data.continent || undefined,
      country: data.country || 'Unknown',
      countryCode: data.countryCode || 'XX',
      region: data.regionName || undefined,
      city: data.city || undefined,
      latitude: data.lat ?? null,
      longitude: data.lon ?? null,
      postal: data.zip || undefined,
      timezone: data.timezone || undefined,
      asn: data.as || undefined,
      isp: data.isp || undefined,
      org: data.org || undefined,
      confidence: 85,
      source: 'ip-api.com',
      timestamp: new Date().toISOString()
    }
  } catch {
    return null
  }
}

async function fetchIPWhoIs(ip: string): Promise<GeoLocation | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    
    const res = await fetch(`https://ipwho.is/${ip}`, {
      headers: { 'User-Agent': 'IP-Tracker-API/1.0' },
      signal: controller.signal
    })
    
    clearTimeout(timeout)
    
    if (!res.ok) return null
    const data = await res.json() as IPWhoIsResponse
    if (!data.success) return null

    return {
      ip: data.ip || ip,
      type: data.type || (ip.includes(':') ? 'IPv6' : 'IPv4'),
      continent: data.continent || undefined,
      country: data.country || 'Unknown',
      countryCode: data.country_code || 'XX',
      region: data.region || undefined,
      city: data.city || undefined,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      postal: data.postal || undefined,
      timezone: data.timezone?.id || undefined,
      asn: data.connection?.asn || undefined,
      isp: data.connection?.isp || undefined,
      org: data.connection?.org || undefined,
      confidence: 70,
      source: 'ipwho.is',
      timestamp: new Date().toISOString()
    }
  } catch {
    return null
  }
}

export async function batchGeolocation(ips: string[]): Promise<{ results: GeoLocation[]; failed: string[] }> {
  const results: GeoLocation[] = []
  const failed: string[] = []
  
  for (const ip of ips) {
    try {
      const data = await getGeolocation(ip)
      results.push(data)
    } catch {
      failed.push(ip)
    }
  }
  
  return { results, failed }
}
