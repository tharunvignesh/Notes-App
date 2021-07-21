const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes)
	})
})

notesRouter.post('/', (request, response, next) => {
	const body = request.body // body section of the page

	if (body.content === undefined) {
		return response.status(400).json({ error: 'content missing' })
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	note
		.save()
		.then((savedNote) => {
			response.json(savedNote)
		})
		.catch((error) => next(error))
})

notesRouter.get('/:id', (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				console.log(note)
				response.json(note)
			} else {
				response.status(404).end() // 404 - Not found
			}
		})
		.catch((error) => {
			next(error)
		})
})

notesRouter.delete('/:id', (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end() // 204 - no content
		})
		.catch((error) => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
	const body = request.body

	const note = {
		content: body.content,
		important: body.important,
	}

	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote)
		})
		.catch((error) => next(error))
})

module.exports = notesRouter
