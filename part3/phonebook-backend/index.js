// •••••••••••••••••••••••••••••••••••••••••••••
// Part3 | phonebook-backend | ex 3.1 - 3.22
// •••••••••••••••••••••••••••••••••••••••••••••

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3001
const Person = require('./models/person')


// custom token for morgan middleware, logs POST requests
morgan.token('req-logger', (req) => JSON.stringify(req.body))

// MIDDLEWARE
app.use(
  express.json(),
  express.static('build'),
  // morgan middleware with custom tokken
  morgan(':method :url :status :res[content-length] - :response-time ms :req-logger'),
  cors()
)


// ----------------------------
// GET: all
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

//GET: by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST: save new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// DELETE: by id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// PUT: updates contact number only
app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    number: request.body.number
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// INFO
app.get('/info', (request, response) => {
  const date = new Date()
  Person.count({}).then(count => {
    response.send(
      `<p>Phonebook has info for ${count} people</p>
      <p>${date}</p>`
    )
  })
})


// UNKNOWN ENDPOINT
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// Middleware function called after all routes
app.use(unknownEndpoint)


// ERROR HANDLING
const errorHandler = (error, request, response, next) => {
  console.log('*'.repeat(50))
  console.error(error.message)
  console.log('*'.repeat(50))

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  else if (error.name === 'MongoServerError') { // POST req with existent name
    return response.status(400).send({ error: error.message })
  }


  next(error)
}
// handler of requests with result to errors
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
