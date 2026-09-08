import { Address4, Address6 } from 'ip-address'

export function isValidIP(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false
  try {
    return new Address4(ip).isValid() || new Address6(ip).isValid()
  } catch {
    return false
  }
}

export function normalizeIP(ip: string): string {
  if (!ip) return ip
  const addr4 = new Address4(ip)
  if (addr4.isValid()) return addr4.correctForm()
  
  const addr6 = new Address6(ip)
  if (addr6.isValid()) return addr6.correctForm()
  
  return ip
}

export function isPrivateIP(ip: string): boolean {
  const addr4 = new Address4(ip)
  if (addr4.isValid()) {
    return addr4.isInSubnet(new Address4('10.0.0.0/8')) ||
           addr4.isInSubnet(new Address4('172.16.0.0/12')) ||
           addr4.isInSubnet(new Address4('192.168.0.0/16')) ||
           addr4.isInSubnet(new Address4('127.0.0.0/8'))
  }
  const addr6 = new Address6(ip)
  if (addr6.isValid()) {
    return addr6.isInSubnet(new Address6('fc00::/7')) ||
           addr6.isInSubnet(new Address6('fe80::/10')) ||
           addr6.isInSubnet(new Address6('::1/128'))
  }
  return false
}