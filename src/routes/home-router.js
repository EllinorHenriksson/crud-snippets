/**
 * The home router.
 *
 * @author Ellinor Henriksson
 * @version 1.0.0
 */

import express from 'express'
import { HomeController } from '../controllers/home-controller.js'

export const router = express.Router()

const controller = new HomeController()

router.get('/', controller.index)
