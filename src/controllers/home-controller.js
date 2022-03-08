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
  index (req, res, next) {
    res.render('home/index')
  }
}
