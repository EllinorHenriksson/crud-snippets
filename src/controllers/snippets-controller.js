/**
 * Module for the SnippetsController.
 *
 * @author Ellinor Henriksson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { User } from '../models/user.js'
import { Snippet } from '../models/snippet.js'

/**
 * Encapsulates a controller.
 */
export class SnippetsController {
  authorizeLogin (req, res, next) {
    if (!req.session.user) {
      next()
    } else {
      next(createError(404))
    }
  }

  authorizeCreate (req, res, next) {
    if (req.session.user) {
      next()
    } else {
      next(createError(404))
    }
  }

  /**
   * Displays a list of all snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    // Show all snippets, to both anonymous and authenticated users.
    try {
      const viewData = {
        snippets: (await Snippet.find()).map(snippet => ({
          code: snippet.code,
          owner: snippet.owner
        })),
        user: req.session.user
      }

      for (const snippet of viewData.snippets) {
        console.log('Code: ', snippet.code, 'Owner: ', snippet.owner)
      }

      res.render('snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  register (req, res, next) {
    // Return html form so that user can register.
    res.render('snippets/register')
  }

  async registerPost (req, res, next) {
    // Register user.
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

  login (req, res, next) {
    // Return html form so that user can log in.
    res.render('snippets/login')
  }

  async loginPost (req, res, next) {
    // Log in user.
    try {
      const user = await User.authenticate(req.body.username, req.body.password)
      req.session.regenerate(error => {
        if (error) {
          throw new Error('Failed to regenerate session.')
        }
      })

      // Store authenticated user in session store.
      req.session.user = user.username

      req.session.flash = { type: 'success', text: 'Login succeeded.' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'error', text: error.message }
      res.redirect('./login')
    }
  }

  logoutPost (req, res, next) {
    // Log out user.
    try {
      req.session.destroy(error => {
        if (error) {
          throw new Error('Failed to log out.')
        }
      })

      // OBS! Hur få till ett flash-meddelande när session redan är destroyed?
      // req.session.flash = { type: 'success', text: 'Logout succeeded.' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'error', text: error.message }
    }
  }

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  create (req, res) {
    // Render a html form. User needs to be authenticated.
    res.render('snippets/create')
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async createPost (req, res) {
    // Create a new snippet. User needs to be autheticated.
    try {
      const snippet = new Snippet({ code: req.body.snippet, owner: req.session.user })
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
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  update (req, res) {
    // Return html form so user can update his/her snippet. User needs to be authenticated, and authorized (i.e. needs to be the owner/creator of the snippet).
  }

  /**
   * Updates snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  updatePost (req, res) {
    // Update snippet. User needs to be authenticated, and authorized (i.e. needs to be the owner/creator of the snippet).
  }

  /**
   * Returns a HTML form for deleting a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  delete (req, res) {
    // Return html form so user can delete his/her snippet. User needs to be authenticated, and authorized (i.e. needs to be the owner/creator of the snippet).
  }

  /**
   * Deletes snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  deletePost (req, res) {
    // Delete snippet. User needs to be authenticated, and authorized (i.e. needs to be the owner/creator of the snippet).
  }
}
