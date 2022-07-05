const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogs')


const initialBlogs = [
  {
    title: 'Blog used in tests',
    author: 'Mr. Test ',
    url: 'www.test.com',
    likes: 1,
  },
  {
    title: 'Another blog created for tests',
    author: 'Mrs. Test',
    url: 'www.anothertest.org',
    likes: 2,
  },
]

// Helper function returns blogs through toJSON()
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})


test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('Correct amount of blog posts returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})


test('Blog posts unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})


test('POST request to api/blogs creates new blog post', async () => {
  const blogPost = {
    title: 'Testing POST request',
    author: 'AL',
    url: 'www.example.com',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(blogPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await blogsInDb()
  expect(blogs).toHaveLength(initialBlogs.length + 1)

  const title = blogs.map(n => n.title)
  expect(title).toContain('Testing POST request')
})


test('Missing likes property will default to 0', async () => {
  const blogPost = {
    title: 'Missing likes peoperty',
    author: 'AL',
    url: 'www.example.com',
  }

  await api
    .post('/api/blogs')
    .send(blogPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await blogsInDb()
  blogs.forEach(blog => {
    if (blog.title === 'Missing likes peoperty') {
      expect(blog.likes).toBe(0)
    }
  })
})


test('Missing title and url properties cause 400 bad request', async () => {
  const blogPost = {
    author: 'AL',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(blogPost)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const blogs = await blogsInDb()
  expect(blogs).toHaveLength(initialBlogs.length)
})

test('DELETE a blogpost', async () => {
  const blogsBefore = await blogsInDb()
  const blogToDelete = blogsBefore[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAfter = await blogsInDb()
  expect(blogsAfter).toHaveLength(initialBlogs.length - 1)
  
  const titles = blogsAfter.map(blog => blog.title)
  expect(titles).not.toContain(blogsAfter.title)

})

test('PUT update a blog post', async () => {
  const blogsBefore = await blogsInDb()
  const blogToUpdate = blogsBefore[0]
  const blogPost = {
    title: 'Updated!',
    author: 'Mr. Test',
    url: 'www.test.com',
    likes: 777,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogPost)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await blogsInDb()
  const updated = blogsAfter[0]
  expect(updated.title).toContain('Updated!')
  expect(updated.likes).toBe(777)

})

afterAll(() => {
  mongoose.connection.close()
})