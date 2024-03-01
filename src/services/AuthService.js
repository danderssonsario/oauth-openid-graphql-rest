/**
 * @file This file contains the AuthService class.
 * @module AuthService
 * @author Daniel Andersson
 */

import axios from 'axios'
import querystring from 'query-string'

// Application modules.
import { HttpError } from '../lib/errors/HttpError.js'

/**
 * Encapsulates a Auth service.
 */
export class AuthService {
  /**
   * Authorizes user.
   *
   * @param {string} code - Query string.
   * @returns {object} - Data from the authorized user.
   */
  async authorizeUser (code) {
    try {
      const response = await axios.post(
        `${process.env.SERVICE_PROVIDER_OAUTH_URL}/token`,
        querystring.stringify({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.REDIRECT_URI
        })
      )

      return response.data
    } catch (error) {
      throw new HttpError(error)
    }
  }
}
