import express from 'express'
import { SnippetsController } from '../controllers/snippets-controller.js'

export const router = express.Router()

const controller = new SnippetsController()

router.get('/', controller.index)

router.get('/register', controller.register)
router.post('/register', controller.registerPost)

router.get('/login', controller.login)
router.post('/login', controller.loginPost)

router.get('/create', controller.create)
router.post('/create', controller.createPost)

router.get('/:id/update', controller.update)
router.post('/:id/update', controller.updatePost)

router.post('/:id/logout', controller.logoutPost)
