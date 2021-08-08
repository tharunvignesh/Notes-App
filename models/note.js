// The note.js file under the models directory only defines the Mongoose schema for notes.
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 5,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	important: Boolean,
	user: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // references the User model
		},
	],
})

noteSchema.set('toJSON', {
	// this schema setting is only for how server should look ie./api/notes
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Note', noteSchema)
