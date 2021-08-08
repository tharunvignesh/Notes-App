const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	name: String,
	passwordHash: String,
	notes: [
		{
			type: mongoose.Schema.Types.ObjectId, // id format ie. _id
			ref: 'Note', // references the Note model
		},
	],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		// adds new column id which converts from Object _id to id String
		delete returnedObject._id
		delete returnedObject.__v
		// the passwordHash should not be revealed
		// delete returnedObject.passwordHash
	},
})

const User = mongoose.model('User', userSchema)

module.exports = User
