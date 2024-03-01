/**
 * @file Defines the view router.
 * @module viewRouter
 * @author Daniel Andersson
 */

// User-land modules.
import express from 'express'

// Application modules.
import { container, TYPES } from '../../config/inversify.config.js'
import { authenticate } from '../../middlewares/authentication.js'

export const router = express.Router()

router.route('/').get((req, res, next) => container.get(TYPES.ResourceController).index(req, res, next))

router.route('/home').get(authenticate, (req, res, next) => container.get(TYPES.ResourceController).home(req, res, next))
router.route('/profile').get(authenticate, (req, res, next) => container.get(TYPES.ResourceController).profile(req, res, next))
router.route('/activities').get(authenticate, (req, res, next) => container.get(TYPES.ResourceController).activities(req, res, next))
router.route('/groups').get(authenticate, (req, res, next) => container.get(TYPES.ResourceController).groups(req, res, next))
