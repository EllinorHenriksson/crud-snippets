/**
 * Module for the HomeController.
 *
 * @author Ellinor Henriksson
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Renders the start page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response objec
   */
  index (req, res) {
    res.render('home/index')
  }
}
