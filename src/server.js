import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'

try {
  // Connect to MongoDB database.
  await connectDB()

  // Create express application.
  const app = express()

  // Get full name of current directory.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Set the URL of the applicaton's root directory.
  const baseURL = process.env.BASE_URL || '/'

  // Use helmet to enfore security.
  app.use(helmet())

  // Use morgan logger to monitor the network traffic.
  app.use(logger('dev'))

  // Create setup for the view engine.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))

  // Parse form requests and populate request object with body object.
  app.use(express.urlencoded({ extended: false }))

  // Serve static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Setup and use session middleware.
  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'strict'
    }
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sessionOptions.cookie.secure = true
  }

  app.use(session(sessionOptions))

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL

    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    if (req.session.user) {
      res.locals.user = req.session.user
    }

    next()
  })

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    if (err.status === 403) {
      return res
        .status(403)
        .sendFile(join(directoryFullName, 'views', 'errors', '403.html'))
    }

    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
    }

    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
        .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
    }

    // Development only!
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })

    console.error(err)
  })

  // Starts HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
