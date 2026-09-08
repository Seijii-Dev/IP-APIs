import { Address4, Address6 } from 'ip-address'

export function isValidIP(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false
  return Address4.isValid(ip) || Address6.isValid(ip)
}

export function normalizeIP(ip: string): string {
  if (!ip) return ip

  if (Address4.isValid(ip)) return new Address4(ip).correctForm()
  if (Address6.isValid(ip)) return new Address6(ip).correctForm()

  return ip
}

export function isPrivateIP(ip: string): boolean {
  if (Address4.isValid(ip)) {
    const addr4 = new Address4(ip)
    return addr4.isInSubnet(new Address4('10.0.0.0/8')) ||
           addr4.isInSubnet(new Address4('172.16.0.0/12')) ||
           addr4.isInSubnet(new Address4('192.168.0.0/16')) ||
           addr4.isInSubnet(new Address4('127.0.0.0/8'))
  }

  if (Address6.isValid(ip)) {
    const addr6 = new Address6(ip)
    return addr6.isInSubnet(new Address6('fc00::/7')) ||
           addr6.isInSubnet(new Address6('fe80::/10')) ||
           addr6.isInSubnet(new Address6('::1/128'))
  }

  return false
}
