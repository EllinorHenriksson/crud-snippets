/**
 * Module for the SnippetsController.
 *
 * @author Ellinor Henriksson
 * @version 1.0.0
 */

import { User } from '../models/user.js'

const viewData = { loggedIn: false }

/**
 * Encapsulates a controller.
 */
export class SnippetsController {
  /**
   * Displays a list of all snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    // Show all snippets, to both anonymous and authenticated users.
    viewData.snippets = [] // KOM IHÅG ATT ÄNDRA
    res.render('snippets/index', { viewData })
  }

  register (req, res, next) {
    // Return html form so that user can register.
    res.render('snippets/register', { viewData })
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
    res.render('/login', { viewData })
  }

  loginPost (req, res, next) {
    // Log in user.
    res.redirect('.')
  }

  logoutPost (req, res, next) {
    // Log out user.
    res.redirect('.')
  }

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  create (req, res) {
    // Render a html form. User needs to be authenticated.
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  createPost (req, res) {
    // Create a new snippet. User needs to be autheticated.
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
