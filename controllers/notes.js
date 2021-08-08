const notesRouter = require('express').Router()
const Note = require('../models/note') // Note database model
const User = require('../models/user') // User database model
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer')) {
		return authorization.substring(7)
	}
	return null
}

notesRouter.get('/', async (request, response) => {
	// populate() lets you reference other documents in other collections
	const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
	// The role of .get() ie./api/notes is fetch data from the db
	response.json(notes)
})

notesRouter.post('/', async (request, response) => {
	const body = request.body // body section of the page

	const token = getTokenFrom(request)
	// eslint-disable-next-line no-undef
	const decodedToken = jwt.verify(token, process.env.SECRET)

	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)

	// const user = await User.findById(body.userId)

	console.log('User: user._id', user._id)

	console.log(user)

	if (body.content === undefined) {
		return response.status(400).json({ error: 'content missing' })
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
		user: user._id,
	})

	const savedNote = await note.save() // We are posting it directly to the database
	user.notes = user.notes.concat(savedNote._id)
	await user.save()
	response.json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
	const note = await Note.findById(request.params.id)
	if (note) {
		response.json(note)
		console.log(note)
	} else {
		response.status(404).end()
	}
})

notesRouter.delete('/:id', async (request, response) => {
	await Note.findByIdAndRemove(request.params.id)
	response.status(204).end() // 204 - no content
})

notesRouter.put('/:id', async (request, response) => {
	const body = request.body

	const note = {
		content: body.content,
		important: body.important,
	}

	const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
		new: true,
	})
	response.json(updatedNote)
})

module.exports = notesRouter
