const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// const helper = require('./test_helper')
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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
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


test('Unique identifier property of the blog posts is named id', async () => {
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

  const blogs = await Blog.find({})
  const blogsToJSON = blogs.map(blog => blog.toJSON())
  expect(blogs).toHaveLength(initialBlogs.length + 1)

  const title = blogsToJSON.map(n => n.title)
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

  const blogs = await Blog.find({})
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

  const blogs = await Blog.find({})
  expect(blogs).toHaveLength(initialBlogs.length)
})


afterAll(() => {
  mongoose.connection.close()
})