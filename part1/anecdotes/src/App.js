import React, { useState } from 'react'

const Button = ({click, text}) => (
    <button onClick={click}>
      {text}
    </button>
)

const Header = ({text}) => <h1>{text}</h1>
const Anecdote = ({text}) => <p>{text}</p>
const Votes = ({text}) => <div>has {text} votes</div>


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(7))

  // finding top anecdote
  const topVote = votes.indexOf(Math.max(...votes))
  const topAnecdote = anecdotes[topVote]

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min +1)) + min
  }

  const getRandomAnecdote = () => {
    return setSelected(getRandomNumber(0, anecdotes.length - 1))
  }

  const handleVotes = () => {
    const copy = [...votes]
    copy[selected] += 1
    return setVotes(copy)
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Anecdote text={anecdotes[selected]} />

      <Votes text={votes[selected]} />
      <Button click={handleVotes} text={"vote"} /> 
      <Button click={getRandomAnecdote} text={"next anecdote"} />  

      <Header text="Anecdote with most votes" />
      <Anecdote text={topAnecdote} />
    </div>
  )
}

export default App