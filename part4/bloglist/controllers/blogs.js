// ----------------------------
// CONTROLLERS 
// ----------------------------
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

// GET: all 
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// POST: Add new blog 
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

// DELETE: a blog with specified id 
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// PUT: update a blog post (title and likes)
blogsRouter.put('/:id', async (request, response) => {
  const { title, likes } = request.body

  const updated = await Blog.findByIdAndUpdate(    
    request.params.id, 
    { title, likes },
    { new: true, runValidators: true, context: 'query' }
  )
  response.status(200).json(updated)
})

module.exports = blogsRouter