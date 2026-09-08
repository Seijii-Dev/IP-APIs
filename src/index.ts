import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import ipRouter from './api/ip.js'
import batchRouter from './api/batch.js'
import { getCacheStats } from './services/cache.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST']
}))

app.use(express.json({ limit: '1mb' }))

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT || '30'),
  message: {
    success: false,
    error: 'Rate limit exceeded. Please wait 60 seconds.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

app.use('/api', limiter)

app.get('/api/health', (req, res) => {
  const cache = getCacheStats()
  res.json({
    status: 'operational',
    version: '1.0.0',
    uptime: process.uptime(),
    cache: cache,
    timestamp: new Date().toISOString()
  })
})

app.use('/api/ip', ipRouter)
app.use('/api/batch', batchRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available: [
      'GET /api/ip/:ip',
      'GET /api/ip?ip=8.8.8.8',
      'GET /api/ip/me',
      'POST /api/batch',
      'GET /api/health'
    ]
  })
})

app.listen(port, () => {
  console.log(`IP Tracker API running on port ${port}`)
})

export default app