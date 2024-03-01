/**
 * @file Defines the main router.
 * @module router
 * @author Daniel Andersson
 */

import express from 'express'
import { HttpError } from '../../lib/errors/HttpError.js'
import { router as authRouter } from './api/authRouter.js'
import { router as resourceRouter } from './api/resourceRouter.js'

export const router = express.Router()

router.use('/', resourceRouter)
router.use('/auth', authRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  next(
    new HttpError({
      message: 'The requested resource was not found.',
      status: 404,
      data: { url: req.originalUrl }
    })
  )
})
