import { Router, Request, Response } from 'express'
import { batchGeolocation } from '../services/geolocation.js'
import { isValidIP } from '../services/validators.js'
import type { BatchResponse } from '../types/index.js'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { ips } = req.body
  
  if (!ips || !Array.isArray(ips)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request body',
      example: { ips: ['8.8.8.8', '1.1.1.1'] }
    })
  }

  if (ips.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'IP array cannot be empty'
    })
  }

  if (ips.length > 50) {
    return res.status(400).json({
      success: false,
      error: 'Maximum 50 IPs per batch request'
    })
  }

  const validIPs = ips.filter(ip => isValidIP(ip))
  const invalidIPs = ips.filter(ip => !isValidIP(ip))

  if (validIPs.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid IPs provided',
      invalid: invalidIPs
    })
  }

  try {
    const { results, failed } = await batchGeolocation(validIPs)
    
    const response: BatchResponse = {
      results,
      failed: [...failed, ...invalidIPs],
      total: ips.length,
      success: results.length
    }
    
    res.json({
      success: true,
      ...response
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