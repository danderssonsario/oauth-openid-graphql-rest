/**
 * @file Defines the AuthController class.
 * @module AuthController
 * @author Daniel Andersson
 */

// Application modules.
import { convertToHttpError } from '../lib/util.js'
import { AuthService } from '../services/AuthService.js'

/**
 * Encapsulates a controller.
 */
export class AuthController {
  /**
   * The service.
   *
   * @type {AuthService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {AuthService} service - A service instantiated from a class with the same capabilities as AuthService.
   */
  constructor (service) {
    this.#service = service
  }

  /**
   * Redirects client to service provider login page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      res.redirect(
        302,
        `${process.env.SERVICE_PROVIDER_OAUTH_URL}/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=${process.env.RESPONSE_TYPE}&state=${process.env.STATE}&scope=${process.env.SCOPE}`
      )
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Authorizes user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authorize (req, res, next) {
    try {
      req.session.user = await this.#service.authorizeUser(req.query.code)
      res.redirect('/home')
    } catch (error) {
      next(convertToHttpError(error))
    }
  }
}
