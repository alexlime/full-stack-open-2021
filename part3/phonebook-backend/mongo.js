const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://alxlime:${password}@cluster0.pjbvc.mongodb.net/phonebook-app?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// if one argument given then then print all entries
if (process.argv.length === 3) {
  mongoose.connect(url)
    .then(() => {
      console.log('Phonebook:')

      Person.find({})
        .then((result) => {
          result.forEach(person => {
            console.log(person.name, person.number)
          })
          return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
    })
}
// if three arguments given then add new person
else if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(() => {

      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })

      return person.save()
    })
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}




