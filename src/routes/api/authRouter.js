/**
 * @file Defines the auth router.
 * @module authRouter
 * @author Daniel Andersson
 */

// User-land modules.
import express from 'express'

// Application modules.
import { container, TYPES } from '../../config/inversify.config.js'

export const router = express.Router()

router
  .route('/')
  .get((req, res, next) => container.get(TYPES.AuthController).login(req, res, next))

router
  .route('/callback')
  .get((req, res, next) => container.get(TYPES.AuthController).authorize(req, res, next))
