const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes
  // console.log(blogs.reduce(reducer, 0))
  return blogs.reduce(reducer, 0)

}

const favoriteBlog = (blogs) => {
  // get top likes int value
  const topLikes = Math.max(...blogs.map(x => x.likes)) 
  // find object that has topLikes
  const favBlog = blogs.find(x => x.likes === topLikes) 
  
  return { 
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes,
  }
}

// Find Author with most blogs (also retruns number of blogs)
const mostBlogs = (blogs) => { 
  // Create "Counter" > sort > grab the first item from sorted array
  const authors = blogs.map(x => x.author) // all authors array
  const countedAuthors = _.countBy(authors) // Counter
  const sortedCountedAuthors = _(countedAuthors).toPairs().orderBy(1, 'desc').value()
  const topAuthor = sortedCountedAuthors[0] // first item from sorted array

  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  }
}

const mostLikes = (blogs) => {
  // Group array of blog objects by author and sum the likes
  const result = blogs
    .reduce((obj, el) => { 
      obj[el.author] = (obj[el.author] || 0) + el.likes;
      return obj;
    }, {})

  // Convert result into array of pairs, sort it, use top most pair
  const topAuthor = _(result).toPairs().orderBy(1, 'desc').value()[0]

  return {
    author: topAuthor[0],
    likes: topAuthor[1],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}