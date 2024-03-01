/**
 * @file This file contains the ResourceService class.
 * @module ResourceService
 * @author Daniel Andersson
 */

import axios from 'axios'

// Application modules.
import { HttpError } from '../lib/errors/HttpError.js'
import { gql, GraphQLClient } from 'graphql-request'
import { jwtDecode } from 'jwt-decode'

/**
 * Encapsulates a Auth service.
 */
export class ResourceService {
  /**
   * Fetches and formats profile data.
   *
   * @param {object} user - Object containing tokens.
   * @returns {object} - Data from the authorized user.
   */
  async fetchProfile (user) {
    try {
      const graphQLClient = new GraphQLClient('https://gitlab.lnu.se/api/graphql', {
        headers: {
          authorization: `Bearer ${user.access_token}`
        }
      })

      const query = gql`
        query {
          currentUser {
            lastActivityOn
          }
        }
      `

      const userPayload = jwtDecode(user.id_token)
      const response = await graphQLClient.request(query)

      return {
        id: userPayload.sub,
        email: userPayload.email,
        username: userPayload.preferred_username,
        name: userPayload.name,
        avatar: userPayload.picture,
        lastActivityOn: response.currentUser.lastActivityOn
      }
    } catch (error) {
      throw new HttpError(error)
    }
  }

  /**
   * Fetches and formats activities data.
   *
   * @param {object} user - Object containing tokens.
   * @param {number} page - Page of data to fetch.
   * @param {number} limit - Number of resorces per page.
   * @returns {object} - Object including activities and page data.
   */
  async fetchActivities (user, page = 1, limit = 20) {
    try {
      const totalActivities = 120
      const totalPages = Math.ceil(totalActivities / limit)

      const response = await axios.get('https://gitlab.lnu.se/api/v4/events', {
        params: {
          per_page: limit,
          page: page <= totalPages ? page : totalPages
        },
        headers: {
          Authorization: `Bearer ${user.access_token}`
        }
      })

      return {
        activities: response.data,
        page,
        totalPages,
        limit
      }
    } catch (error) {
      throw new HttpError(error)
    }
  }

  /**
   * Fetches and formats profile data.
   *
   * @param {object} user - Object containing tokens.
   * @returns {object} - Data from the authorized user.
   */
  async fetchGroups (user) {
    try {
      const graphQLClient = new GraphQLClient('https://gitlab.lnu.se/api/graphql', {
        headers: {
          authorization: `Bearer ${user.access_token}`
        }
      })

      const query = gql`
        query {
          currentUser {
            groups(first: 3) {
              nodes {
                avatarUrl
                name
                webUrl
                fullPath
                projects(first: 5) {
                  nodes {
                    avatarUrl
                    name
                    webUrl
                    fullPath
                    repository {
                      tree {
                        lastCommit {
                          committedDate
                          authorGravatar
                          author {
                            name
                            username
                          }
                        }
                      }
                    }
                  }
                  pageInfo {
                    hasNextPage
                  }
                }
              }
              pageInfo {
                hasNextPage
              }
            }
          }
        }
      `

      const response = await graphQLClient.request(query)

      return response.currentUser.groups
    } catch (error) {
      throw new HttpError(error)
    }
  }
}
