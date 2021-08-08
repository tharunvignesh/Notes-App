// The responsibility of establishing the connection to the database
// has been given to the app.js module
const config = require('./utils/config') // env variables
const express = require('express')
require('express-async-errors') // this package looks after async errors
const app = express()
const cors = require('cors') // cross origin resource sharing
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger') // console & error logging
const mongoose = require('mongoose')

logger.info(`Connecting to ${config.MONGODB_URI}`)

mongoose
	.connect(config.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})

app.use(cors())
app.use(express.static('build'))
app.use(express.json()) // middleware for request.body
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint)
// this has to be the last loaded middleware.
app.use(middleware.errorHandler) // handler of requests with result to errors

module.exports = app
