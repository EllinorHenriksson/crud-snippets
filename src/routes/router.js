/**
 * The routes.
 *
 * @author Ellinor Henriksson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as snippetsRouter } from './snippets-router.js'

export const router = express.Router()

router.use('/', snippetsRouter)

router.use('*', (req, res, next) => next(createError(404)))
