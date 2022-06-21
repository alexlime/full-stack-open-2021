const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    unique: true, // used by indexing
    dropDups: true, // drops duplicates
    required: [true, 'User name required'],
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'User phone number required'],
    validate: {
      validator: function(number) {
        return /^[0-9]{2,3}-[0-9]{6,12}$/.test(number)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)