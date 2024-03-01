/**
 * @file This file configures the rate limiter.
 * @module rateLimiter
 * @author Mats Loock
 * @see {@link https://gitlab.lnu.se/1dv027/content/examples/example-restful-tasks}
 */

// User-land modules.
import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})
