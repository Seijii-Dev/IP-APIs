import { Router, Request, Response } from 'express'
import { getGeolocation } from '../services/geolocation.js'
import { isValidIP, normalizeIP } from '../services/validators.js'

const router = Router()

router.get('/:ip', async (req: Request, res: Response) => {
  const ip = req.params.ip
  
  if (!isValidIP(ip)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid IP address format',
      validFormats: ['IPv4 (1.2.3.4)', 'IPv6 (2001:db8::1)']
    })
  }

  try {
    const data = await getGeolocation(ip)
    res.json({
      success: true,
      data
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      success: false,
      error: message
    })
  }
})

router.get('/', async (req: Request, res: Response) => {
  const ip = req.query.ip as string
  
  if (!ip) {
    return res.status(400).json({
      success: false,
      error: 'Missing ip parameter',
      example: '/api/ip?ip=8.8.8.8'
    })
  }

  if (!isValidIP(ip)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid IP address format'
    })
  }

  try {
    const data = await getGeolocation(ip)
    res.json({
      success: true,
      data
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      success: false,
      error: message
    })
  }
})

router.get('/me', async (req: Request, res: Response) => {
  const clientIP = req.headers['x-forwarded-for'] as string || 
                   req.socket.remoteAddress || 
                   '0.0.0.0'
  
  const normalized = normalizeIP(clientIP.split(',')[0].trim())
  
  try {
    const data = await getGeolocation(normalized)
    res.json({
      success: true,
      data
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      success: false,
      error: message
    })
  }
})

export default router