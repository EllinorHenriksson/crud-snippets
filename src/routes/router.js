/**
 * The routes.
 *
 * @author Ellinor Henriksson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as homeRouter } from './home-router.js'
import { router as snippetsRouter } from './snippets-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/snippets', snippetsRouter)
router.use('*', (req, res, next) => next(createError(404)))
