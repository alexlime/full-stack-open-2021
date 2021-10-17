import React from 'react'


// Renders course name heading
const Header = ({course}) => {
	return (
		<h1>{course.name}</h1>
	)
}

// Renders each part
const Part = ({part, ex}) => {
	return (
		<p> {part} {ex} </p>		
	)
}

// Renders the content section that consists of several parts
const Content = ({course}) => {
	// xxx Told not to use loops...
	// const eachPart = course.parts.map(value => 
	// 	<Part part={value.name} ex={value.exercises} />
	// )
	return (
		<div>
			<Part part={course.parts[0].name} ex={course.parts[0].exercises} />
			<Part part={course.parts[1].name} ex={course.parts[1].exercises} />
			<Part part={course.parts[2].name} ex={course.parts[2].exercises} />
		</div>
	)
}

// Calculates the total of number of exercises
const Total = ({course}) => {
	let sum = 0
	course.parts.map( value => sum = sum + value.exercises )
	return (
		<p>
			Number of exercises: { sum }
		</p>
	)
}


const App = () => {
	const course = {
		name: 'Half Stack application development',
		parts: [
			{
				name: 'Fundamentals of React',
				exercises: 10
			},
			{
				name: 'Using props to pass data',
				exercises: 7
			},
			{
				name: 'State of a component',
				exercises: 14
			}
		]
	}
	return (
		<div>
			<Header course={course} />
			<Content course={course}/>
			<Total course={course} />
		</div>
	)
}

export default App
