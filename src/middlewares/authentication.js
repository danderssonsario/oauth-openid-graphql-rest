/**
 * @file Authentication middlewares.
 * @module middlewares
 * @author Daniel Andersson
 */

// Application modules.
import { convertToHttpError } from '../lib/util.js'

/**
 * Authenticates a request based on session.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const authenticate = async (req, res, next) => {
  try {
    if (req.session.user) {
      next()
    } else {
      req.session.user = null
      res.redirect('/')
    }
  } catch (error) {
    next(convertToHttpError(error))
  }
}
