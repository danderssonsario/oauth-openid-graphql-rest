/**
 * @file Defines the ResourceController class.
 * @module ResourceController
 * @author Daniel Andersson
 */

// Application modules.

import { convertToHttpError } from '../lib/util.js'
import { ResourceService } from '../services/ResourceService.js'

/**
 * Encapsulates a controller.
 */
export class ResourceController {
  /**
   * The service.
   *
   * @type {ResourceService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {ResourceService} service - A service instantiated from a class with the same capabilities as ResourceService.
   */
  constructor (service) {
    this.#service = service
  }

  /**
   * Renders the start page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      res.render('index')
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Renders home page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async home (req, res, next) {
    try {
      res.render('home')
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Renders profile page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async profile (req, res, next) {
    try {
      const profile = this.#service.fetchProfile(req.session.user)

      res.render('profile', profile)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Renders page with latest activities.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async activities (req, res, next) {
    try {
      const activities = this.#service.fetchActivities(req.session.user, parseInt(req.query.page), parseInt(req.query.limit))

      res.render('activities', activities)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Renders groups page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async groups (req, res, next) {
    try {
      const groups = this.#service.fetchGroups(req.session.user)

      res.render('groups', { groups })
    } catch (error) {
      next(convertToHttpError(error))
    }
  }
}
