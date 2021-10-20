import React from 'react'

const Header = ({ name }) => {
  return (
    <h2>{name}</h2>
  )
}

const Total = ({ course }) => {

  const exercises = course.parts.map(part => part.exercises)
  const sum = exercises.reduce((x,y) => x + y)

  return(
    <strong>Total of {sum} exercises</strong>
  ) 
}

const Part = (props) => {
  return (
    <p>{props.part.name} {props.part.exercises}</p>    
  )
}

const Content = ({ course }) => {
   return (
    <div>
      {course.parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default Course