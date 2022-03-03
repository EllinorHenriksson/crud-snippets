import express from 'express'
import { SnippetsController } from '../controllers/snippets-controller.js'

export const router = express.Router()

const controller = new SnippetsController()

router.get('/', controller.index)
router.post('/', controller.indexPost)

router.get('/register', controller.authorizeRegLogin, controller.register)
router.post('/register', controller.authorizeRegLogin, controller.registerPost)

router.get('/login', controller.authorizeRegLogin, controller.login)
router.post('/login', controller.authorizeRegLogin, controller.loginPost)

router.get('/logout', controller.authorizeCreLogout, controller.logout)
router.post('/logout', controller.authorizeCreLogout, controller.logoutPost)

router.get('/create', controller.authorizeCreLogout, controller.create)
router.post('/create', controller.authorizeCreLogout, controller.createPost)

router.get('/:id/update', controller.authorizeUpDel, controller.update)
router.post('/:id/update', controller.authorizeUpDel, controller.updatePost)

router.get('/:id/delete', controller.authorizeUpDel, controller.delete)
router.post('/:id/delete', controller.authorizeUpDel, controller.deletePost)
