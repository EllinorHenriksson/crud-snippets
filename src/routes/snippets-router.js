import express from 'express'
import { SnippetsController } from '../controllers/snippets-controller.js'

export const router = express.Router()

const controller = new SnippetsController()

router.get('/', controller.index)

router.get('/filter', controller.filter)
router.post('/filter', controller.filterPost)

router.get('/register', controller.register)
router.post('/register', controller.registerPost)

router.get('/login', controller.authorizeLogin, controller.login)
router.post('/login', controller.authorizeLogin, controller.loginPost)

router.get('/create', controller.authorizeCreate, controller.create)
router.post('/create', controller.authorizeCreate, controller.createPost)

router.get('/:id/update', controller.update)
router.post('/:id/update', controller.updatePost)

router.get('/:id/delete', controller.authorizeDelete, controller.delete)
router.post('/:id/delete', controller.authorizeDelete, controller.deletePost)

// OBS! Fundera på om path bör vara /user=username/logout
router.post('/logout', controller.logoutPost)
