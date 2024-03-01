/**
 * @file Defines the main application.
 * @module server
 * @author Daniel Andersson
 */

// Must be first!
import httpContext from 'express-http-context'

// Built-in modules.
import { randomUUID } from 'node:crypto'
import http from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// User-land modules.
import '@lnu/json-js-cycle'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import session from 'express-session'
import expressLayouts from 'express-ejs-layouts'

// Application modules.
import { morganLogger } from './config/morgan.js'
import { limiter } from './config/rateLimiter.js'
import { logger } from './config/winston.js'
import { router } from './routes/router.js'
import { sessionOptions } from './config/sessionOptions.js'

try {
  // Create an Express application.
  const app = express()

  // Setup and use session middleware (https://github.com/expressjs/session)
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy
  }
  app.use(session(sessionOptions))

  // Get the directory name of this module's path.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Set the base URL to use for all relative URLs in a document.
  const baseURL = process.env.BASE_URL || '/'

  // View engine setup.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))
  app.set('layout extractScripts', true)
  app.set('layout extractStyles', true)
  app.use(expressLayouts)

  // Serve static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Set various HTTP headers to make the application little more secure.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/'],
          styleSrc: ["'self'", 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/'],
          imgSrc: ["'self'", 'https://secure.gravatar.com/avatar/', 'data:', 'https://gitlab.lnu.se/']
        }
      }
    })
  )

  // Enable CORS.
  app.use(cors())

  // Parse requests of the content type application/json.
  app.use(express.json())

  // Add the request-scoped context.
  app.use(httpContext.middleware)

  // Use a morgan logger.
  app.use(morganLogger)

  // Apply the rate limiting middleware to all requests.
  app.use(limiter)

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Add a request UUID to each request and store information about
    // each request in the request-scoped context.
    req.requestUuid = randomUUID()
    httpContext.set('request', req)

    // Pass values to view.
    res.locals.baseURL = baseURL
    res.locals.isAuthenticated = !!req.session.user

    next()
  })

  // Register routes.
  app.use('/', router)

  // Error handler
  app.use((err, req, res, next) => {
    logger.error(err.message, { error: err })

    if (process.env.NODE_ENV === 'production') {
      // Ensure a valid status code is set for the error.
      // If the status code is not provided, default to 500 (Internal Server Error).
      // This prevents leakage of sensitive error details to the client.
      if (!err.status) {
        err.status = 500
        err.message = http.STATUS_CODES[err.status]
      }

      // Send only the error message and status code to prevent leakage of
      // sensitive information.
      res.status(err.status).json({
        error: err.message
      })

      return
    }

    // ---------------------------------------------------
    // ⚠️ WARNING: Development Environment Only!
    //             Detailed error information is provided.
    // ---------------------------------------------------

    // Deep copies the error object and returns a new object with
    // enumerable and non-enumerable properties (cyclical structures are handled).
    const copy = JSON.decycle(err, { includeNonEnumerableProperties: true })

    return res.status(err.status || 500).json(copy)
  })

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.NODEJS_EXPRESS_PORT || 3030, () => {
    logger.info(`Server running at http://localhost:${server.address().port}`)
    logger.info('Press Ctrl-C to terminate...')
  })
} catch (err) {
  logger.error(err.message, { error: err })
  process.exitCode = 1
}
