/**
 * Module for the SnippetsController.
 *
 * @author Ellinor Henriksson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { formatDistanceToNow } from 'date-fns'
import { User } from '../models/user.js'
import { Snippet } from '../models/snippet.js'

/**
 * Encapsulates a controller.
 */
export class SnippetsController {
  /**
   * Authorizes the user, who must be anonymous.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorizeRegLogin (req, res, next) {
    if (!req.session.user) {
      next()
    } else {
      next(createError(404))
    }
  }

  /**
   * Authorizes the user, who must be authenticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorizeCreLogout (req, res, next) {
    if (req.session.user) {
      next()
    } else {
      next(createError(404))
    }
  }

  /**
   * Authorizes the user, who must be authenticated and own the snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authorizeUpDel (req, res, next) {
    try {
      const firstIndex = req.url.indexOf('/')
      const secondIndex = req.url.indexOf('/', firstIndex + 1)
      const id = req.url.slice(firstIndex + 1, secondIndex)
      const snippet = await Snippet.findById(id)

      if (!req.session.user) {
        next(createError(404))
      } else if (req.session.user !== snippet.owner) {
        next(createError(403))
      } else {
        next()
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a list of snippets, with and without filter.
   * User can be either anonymous or authenticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = { user: req.session.user }
      let filter
      if (req.session.filter) {
        const tag = req.session.filter.tag
        const owner = req.session.filter.owner

        // Create filter for finding specific snippets in collection.
        filter = {}
        if (tag) {
          filter.tags = tag
        }
        if (owner) {
          filter.owner = owner
        }

        viewData.filter = { tag: tag, owner: owner }
      }

      viewData.snippets = (await Snippet.find(filter))
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map(snippet => ({
          id: snippet._id,
          code: snippet.code,
          owner: snippet.owner,
          tags: snippet.tags,
          updated: formatDistanceToNow(snippet.updatedAt, { addSuffix: true })
        }))

      res.render('snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Filters the snippets by one tag and/or one owner, or clears filter.
   * User can be either anonymous or authenticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  indexPost (req, res) {
    // If filter is applied
    if (Object.keys(req.body).length !== 0) {
      // If at least one property is set
      if (req.body.tag || req.body.owner) {
        const tag = req.body.tag.trim()
        const owner = req.body.owner.trim()

        // If more than one tag or one owner is set
        if (tag.includes(' ') || owner.includes(' ')) {
          req.session.flash = { type: 'error', text: 'You may only include one tag and/or one owner.' }
        } else {
          req.session.filter = { tag: tag, owner: owner }
        }
      // If no property is set.
      } else {
        req.session.flash = { type: 'error', text: 'You must include one tag and/or one owner.' }
      }
    // If filter is cleared
    } else {
      delete req.session.filter
    }

    res.redirect('./snippets')
  }

  /**
   * Returns a HTML form for the user to register.
   * User must be anonymous.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  register (req, res) {
    res.render('snippets/register')
  }

  /**
   * Registers user by storing the username and password in a MongoDB collection.
   * User must be anonymous.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async registerPost (req, res) {
    try {
      const user = new User({ username: req.body.username, password: req.body.password })
      await user.save()

      req.session.flash = { type: 'success', text: 'Registration succeeded.' }

      res.redirect('./login')
    } catch (error) {
      req.session.flash = { type: 'error', text: error.message }
      res.redirect('./register')
    }
  }

  /**
   * Returns a HTML form for the user to log in.
   * User must be anonymous.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  login (req, res) {
    res.render('snippets/login')
  }

  /**
   * Logs in a user by regenerating the session.
   * User must be anonymous.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async loginPost (req, res) {
    try {
      const user = await User.authenticate(req.body.username, req.body.password)
      req.session.regenerate(error => {
        if (error) {
          throw new Error('Failed to regenerate session.')
        }
      })

      // Store authenticated user in session store.
      req.session.user = user.username

      req.session.flash = { type: 'success', text: `Welcome ${user.username}!` }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'error', text: error.message }
      res.redirect('./login')
    }
  }

  /**
   * Returns a HTML form for the user to log out.
   * User must be autheticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  logout (req, res) {
    res.render('snippets/logout')
  }

  /**
   * Logs out a user by destroying the session.
   * User must be autheticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  logoutPost (req, res) {
    try {
      req.session.destroy(error => {
        if (error) {
          throw new Error('Failed to log out.')
        }
      })
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'error', text: error.message }
    }
  }

  /**
   * Returns a HTML form for creating a new snippet.
   * User must be autheticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  create (req, res) {
    res.render('snippets/create')
  }

  /**
   * Creates a new snippet.
   * User must be autheticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async createPost (req, res) {
    try {
      const snippet = new Snippet({
        code: req.body.snippet,
        owner: req.session.user,
        tags: req.body.tags.trim().split(' ').map(tag => {
          if (!tag.startsWith('#')) {
            return tag.padStart(tag.length + 1, '#')
          }
          return tag
        })
      })
      await snippet.save()

      req.session.flash = { type: 'success', text: 'Snippet was successfully created.' }

      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'error', text: error.message }
      res.redirect('./create')
    }
  }

  /**
   * Returns a HTML form for updating a snippet.
   * User must be authenticated and authorized (i.e. owner of the snippet).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const firstIndex = req.url.indexOf('/')
      const secondIndex = req.url.indexOf('/', firstIndex + 1)
      const id = req.url.slice(firstIndex + 1, secondIndex)

      const snippet = await Snippet.findById(id)

      const viewData = {
        id: id,
        code: snippet.code,
        tags: snippet.tags.join(' ')
      }

      res.render('snippets/update', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a snippet.
   * User must be authenticated and authorized (i.e. owner of the snippet).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async updatePost (req, res) {
    try {
      const id = req.body.id
      const code = req.body.code
      const tags = req.body.tags.trim().split(' ').map(tag => {
        if (!tag.startsWith('#')) {
          return tag.padStart(tag.length + 1, '#')
        }
        return tag
      })

      const snippet = await Snippet.findById(id)
      if (snippet) {
        snippet.code = code
        snippet.tags = tags
        await snippet.save()
        req.session.flash = { type: 'success', text: 'The snippet was successfully updated.' }
      } else {
        req.session.flash = { type: 'error', text: 'The snippet was deleted by another user after you accessed the code.' }
      }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'error', text: error.message }
      res.redirect('./update')
    }
  }

  /**
   * Returns a HTML form for deleting a snippet.
   * User must be authenticated and authorized (i.e. owner of the snippet).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  delete (req, res) {
    const firstIndex = req.url.indexOf('/')
    const secondIndex = req.url.indexOf('/', firstIndex + 1)
    const id = req.url.slice(firstIndex + 1, secondIndex)

    const viewData = { id: id }
    res.render('snippets/delete', { viewData })
  }

  /**
   * Deletes a snippet.
   * User must be authenticated and authorized (i.e. owner of the snippet).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async deletePost (req, res) {
    try {
      await Snippet.findByIdAndDelete(req.body.id)
      req.session.flash = { type: 'success', text: 'The snippet was successfully deleted.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'error', text: error.message }
      res.redirect('./delete')
    }
  }
}
