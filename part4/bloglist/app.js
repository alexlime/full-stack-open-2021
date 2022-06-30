// --------------------------------
// APP
// ----------------------------
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')

logger.info('Connecting to MongoDB...')

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => {
    logger.error('Error connecting to MongoDB:', err.message)
  })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter) // in controllers

module.exports = app