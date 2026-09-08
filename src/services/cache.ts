import type { CacheEntry, GeoLocation } from '../types/index.js'

const cache = new Map<string, CacheEntry>()
const TTL = parseInt(process.env.CACHE_TTL || '60') * 1000

export function getCached(ip: string): GeoLocation | null {
  const entry = cache.get(ip)
  if (!entry) return null
  
  if (Date.now() > entry.expiry) {
    cache.delete(ip)
    return null
  }
  
  return entry.data
}

export function setCache(ip: string, data: GeoLocation): void {
  cache.set(ip, {
    data,
    expiry: Date.now() + TTL
  })
}

export function clearCache(): void {
  cache.clear()
}

export function getCacheStats(): { size: number; ttlSeconds: number } {
  return {
    size: cache.size,
    ttlSeconds: TTL / 1000
  }
}